import AsyncStorage from '@react-native-async-storage/async-storage';
import { CalculationMethod, Coordinates, HighLatitudeRule, Madhab, PrayerTimes, Qibla } from 'adhan';

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
   * FIXED: Now accepts coordinates to properly calculate tomorrow's Fajr
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


  getHijriDate(date: Date = new Date()): HijriDate {
    const gY = date.getFullYear();
    const gM = date.getMonth() + 1;
    const gD = date.getDate();

    // Gregorian to Julian Day calculation
    const a = Math.floor((14 - gM) / 12);
    const y = gY + 4800 - a;
    const m = gM + 12 * a - 3;

    const jd = gD + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Julian Day to Hijri conversion
    const N = jd - 1948440 + 0.5;
    const q = Math.floor(N / 10631);
    const r = N % 10631;
    const a2 = Math.floor(r / 325);
    const b = r % 325;
    const c = Math.floor(b / 30);
    const d = b % 30;

    let islamicYear = 30 * q + a2 + 1;
    let islamicMonth = c + 1;
    let islamicDay = Math.floor(d + 1);

    // Ensure valid ranges
    if (islamicMonth > 12) {
      islamicMonth = 12;
    }
    if (islamicDay > 30) {
      islamicDay = 30;
    }
    if (islamicDay < 1) {
      islamicDay = 1;
    }

    const monthNames = [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
      'Ramadan', 'Shawwal', 'Dhul-Qadah', 'Dhul-Hijjah'
    ];

    const monthIndex = Math.max(0, Math.min(11, islamicMonth - 1));
    const monthName = monthNames[monthIndex];

    return {
      day: islamicDay,
      month: islamicMonth,
      monthName: monthName,
      year: islamicYear,
      formatted: `${islamicDay} ${monthName} | ${islamicYear}AH`,
    };
  }

  /**
   * Check if it's a forbidden prayer time
   */
  isForbiddenTime(prayerTimes: PrayerTimesData): boolean {
    const now = new Date();
    const sunriseEnd = new Date(prayerTimes.sunrise);
    sunriseEnd.setMinutes(sunriseEnd.getMinutes() + 15);

    const noonStart = new Date(prayerTimes.dhuhr);
    noonStart.setMinutes(noonStart.getMinutes() - 8);
    const noonEnd = new Date(prayerTimes.dhuhr);
    noonEnd.setMinutes(noonEnd.getMinutes() + 8);

    const sunsetStart = new Date(prayerTimes.maghrib);
    sunsetStart.setMinutes(sunsetStart.getMinutes() - 15);

    return (
      (now >= prayerTimes.sunrise && now <= sunriseEnd) ||
      (now >= noonStart && now <= noonEnd) ||
      (now >= sunsetStart && now <= prayerTimes.maghrib)
    );
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