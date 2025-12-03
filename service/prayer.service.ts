// service/prayer.service.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalculationMethod, Coordinates, HighLatitudeRule, Madhab, PrayerTimes, Qibla } from 'adhan';
import moment from 'moment-hijri'; // Changed from regular moment

export interface PrayerTimesData {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
  qibla: number;
}

export interface HijriDate {
  day: number;
  month: number;
  monthName: string;
  year: number;
  formatted: string;
}

export interface SavedLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  timestamp: number;
}

export interface PrayerSettings {
  calculationMethod: string;
  madhab: string;
  highLatitudeRule: string;
}

export interface ForbiddenTime {
  name: string;
  start: Date;
  end: Date;
  type: 'sunrise' | 'zawal' | 'sunset';
  description: string;
}

const STORAGE_KEYS = {
  LOCATION: '@prayer_location',
  SETTINGS: '@prayer_settings',
  CACHED_TIMES: '@prayer_times_cache',
};

const DEFAULT_SETTINGS: PrayerSettings = {
  calculationMethod: 'MuslimWorldLeague',
  madhab: 'Shafi',
  highLatitudeRule: 'MiddleOfTheNight',
};

class PrayerService {
  /**
   * Calculate prayer times for a given location and date
   */
  calculatePrayerTimes(
    latitude: number,
    longitude: number,
    date: Date = new Date(),
    settings?: PrayerSettings
  ): PrayerTimesData {
    const coordinates = new Coordinates(latitude, longitude);
    const params = this.getCalculationParams(settings);
    const prayerTimes = new PrayerTimes(coordinates, date, params);
    const qibla = Qibla(coordinates);

    return {
      fajr: prayerTimes.fajr,
      sunrise: prayerTimes.sunrise,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
      qibla: qibla,
    };
  }

  /**
   * Get calculation parameters based on settings
   */
  private getCalculationParams(settings?: PrayerSettings) {
    const config = settings || DEFAULT_SETTINGS;

    // Get calculation method
    let params = CalculationMethod[config.calculationMethod as keyof typeof CalculationMethod]();

    // Set madhab
    params.madhab = Madhab[config.madhab as keyof typeof Madhab];

    // Set high latitude rule
    params.highLatitudeRule = HighLatitudeRule[config.highLatitudeRule as keyof typeof HighLatitudeRule];

    return params;
  }

  /**
   * Get the current prayer name
   */
  getCurrentPrayer(prayerTimes: PrayerTimesData): string {
    const now = new Date();
    const prayers: [string, Date][] = [
      ['Fajr', prayerTimes.fajr],
      ['Sunrise', prayerTimes.sunrise],
      ['Dhuhr', prayerTimes.dhuhr],
      ['Asr', prayerTimes.asr],
      ['Maghrib', prayerTimes.maghrib],
      ['Isha', prayerTimes.isha],
    ];

    for (let i = prayers.length - 1; i >= 0; i--) {
      if (now >= prayers[i][1]) {
        return prayers[i][0];
      }
    }

    return 'Isha'; // Default to Isha if before Fajr
  }

  /**
   * Get the next prayer name and time
   */
  getNextPrayer(
    prayerTimes: PrayerTimesData,
    latitude: number,
    longitude: number,
    settings?: PrayerSettings
  ): { name: string; time: Date } {
    const now = new Date();
    const prayers: [string, Date][] = [
      ['Fajr', prayerTimes.fajr],
      ['Dhuhr', prayerTimes.dhuhr],
      ['Asr', prayerTimes.asr],
      ['Maghrib', prayerTimes.maghrib],
      ['Isha', prayerTimes.isha],
    ];

    for (const [name, time] of prayers) {
      if (now < time) {
        return { name, time };
      }
    }

    // If all prayers have passed, return tomorrow's Fajr
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = this.calculatePrayerTimes(latitude, longitude, tomorrow, settings);
    return { name: 'Fajr', time: tomorrowTimes.fajr };
  }

  /**
   * Get time remaining until next prayer
   */
  getTimeUntilNextPrayer(nextPrayerTime: Date): string {
    const now = new Date();
    const diff = nextPrayerTime.getTime() - now.getTime();

    if (diff <= 0) return '00:00:00';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Get accurate Hijri date using moment-hijri library with Umm al-Qura calendar
   */
  getHijriDate(date: Date = new Date()): HijriDate {
    // Use moment-hijri which implements the Umm al-Qura calendar
    const hijriMoment = moment(date);

    const monthNames = [
      'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
      'Ramadan', 'Shawwal', "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ];

    // Get Hijri date components
    const day = hijriMoment.iDate(); // Islamic date
    const month = hijriMoment.iMonth(); // Islamic month (0-11)
    const year = hijriMoment.iYear(); // Islamic year
    const monthName = monthNames[month];

    return {
      day,
      month: month + 1, // Return 1-12 for consistency
      monthName,
      year,
      formatted: `${day} ${monthName} ${year} AH`,
    };
  }

  /**
   * Calculate accurate forbidden prayer times
   */
  getForbiddenTimes(prayerTimes: PrayerTimesData, latitude: number, longitude: number): ForbiddenTime[] {
    const forbiddenTimes: ForbiddenTime[] = [];

    // 1. SUNRISE FORBIDDEN TIME
    const sunriseStart = prayerTimes.sunrise;
    const sunriseEnd = new Date(prayerTimes.sunrise);
    sunriseEnd.setMinutes(sunriseEnd.getMinutes() + 15);

    forbiddenTimes.push({
      name: 'Sunrise',
      start: sunriseStart,
      end: sunriseEnd,
      type: 'sunrise',
      description: 'When the sun is rising'
    });

    // 2. ZAWAL (SOLAR NOON) FORBIDDEN TIME
    const zawalTime = this.calculateZawal(prayerTimes.dhuhr, latitude);
    const zawalStart = new Date(zawalTime);
    zawalStart.setMinutes(zawalStart.getMinutes() - 5);
    const zawalEnd = new Date(prayerTimes.dhuhr);

    forbiddenTimes.push({
      name: 'Noon',
      start: zawalStart,
      end: zawalEnd,
      type: 'zawal',
      description: 'When the sun is at its zenith'
    });

    // 3. SUNSET FORBIDDEN TIME
    const sunsetStart = new Date(prayerTimes.maghrib);
    sunsetStart.setMinutes(sunsetStart.getMinutes() - 18);
    const sunsetEnd = prayerTimes.maghrib;

    forbiddenTimes.push({
      name: 'Sunset',
      start: sunsetStart,
      end: sunsetEnd,
      type: 'sunset',
      description: 'When the sun is setting'
    });

    return forbiddenTimes;
  }

  /**
   * Calculate Zawal (Solar Noon) time
   */
  private calculateZawal(dhuhrTime: Date, latitude: number): Date {
    const zawalTime = new Date(dhuhrTime);
    zawalTime.setMinutes(zawalTime.getMinutes() - 3);
    return zawalTime;
  }

  /**
   * Check if current time is a forbidden prayer time
   */
  isForbiddenTime(prayerTimes: PrayerTimesData, latitude?: number, longitude?: number): boolean {
    const now = new Date();
    const lat = latitude || 0;
    const lon = longitude || 0;
    const forbiddenTimes = this.getForbiddenTimes(prayerTimes, lat, lon);
    return forbiddenTimes.some(ft => now >= ft.start && now <= ft.end);
  }

  /**
   * Get current forbidden period if any
   */
  getCurrentForbiddenPeriod(prayerTimes: PrayerTimesData, latitude: number, longitude: number): ForbiddenTime | null {
    const now = new Date();
    const forbiddenTimes = this.getForbiddenTimes(prayerTimes, latitude, longitude);
    return forbiddenTimes.find(ft => now >= ft.start && now <= ft.end) || null;
  }

  /**
   * Get next forbidden period
   */
  getNextForbiddenPeriod(prayerTimes: PrayerTimesData, latitude: number, longitude: number): ForbiddenTime | null {
    const now = new Date();
    const forbiddenTimes = this.getForbiddenTimes(prayerTimes, latitude, longitude);
    return forbiddenTimes.find(ft => ft.start > now) || null;
  }

  /**
   * Save location to storage
   */
  async saveLocation(location: SavedLocation): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LOCATION, JSON.stringify(location));
    } catch (error) {
      console.error('Error saving location:', error);
      throw error;
    }
  }

  /**
   * Get saved location from storage
   */
  async getSavedLocation(): Promise<SavedLocation | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LOCATION);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting saved location:', error);
      return null;
    }
  }

  /**
   * Save prayer settings
   */
  async saveSettings(settings: PrayerSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  /**
   * Get saved prayer settings
   */
  async getSettings(): Promise<PrayerSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Cache prayer times for a date
   */
  async cachePrayerTimes(date: Date, times: PrayerTimesData): Promise<void> {
    try {
      const dateKey = date.toISOString().split('T')[0];
      const cache = await this.getCachedTimes();
      cache[dateKey] = {
        ...times,
        fajr: times.fajr.toISOString(),
        sunrise: times.sunrise.toISOString(),
        dhuhr: times.dhuhr.toISOString(),
        asr: times.asr.toISOString(),
        maghrib: times.maghrib.toISOString(),
        isha: times.isha.toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEYS.CACHED_TIMES, JSON.stringify(cache));
    } catch (error) {
      console.error('Error caching prayer times:', error);
    }
  }

  /**
   * Get cached prayer times
   */
  private async getCachedTimes(): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_TIMES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting cached times:', error);
      return {};
    }
  }

  /**
   * Format time to 12-hour format
   */
  formatTime(date: Date): string {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }

  /**
   * Format date
   */
  formatDate(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  }
}

export default new PrayerService();