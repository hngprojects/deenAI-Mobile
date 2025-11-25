// service/prayer.service.ts
import { 
  Coordinates, 
  CalculationMethod, 
  PrayerTimes as AdhanPrayerTimes,
  Prayer,
  Qibla
} from 'adhan';
import { LocationCoordinates } from './location.service';

export interface PrayerTimesResult {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export interface ForbiddenTimesResult {
  sunriseStart: Date;
  sunriseEnd: Date;
  noonStart: Date;
  noonEnd: Date;
  sunsetStart: Date;
  sunsetEnd: Date;
}

class PrayerService {
  /**
   * Format time to 12-hour format with AM/PM
   */
  private formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  /**
   * Calculate prayer times for a given location and date
   */
  calculatePrayerTimes(
    location: LocationCoordinates,
    date: Date = new Date()
  ): PrayerTimesResult {
    const coordinates = new Coordinates(
      location.latitude,
      location.longitude
    );

    // Use Muslim World League calculation method
    const params = CalculationMethod.MuslimWorldLeague();
    
    const prayerTimes = new AdhanPrayerTimes(coordinates, date, params);

    return {
      fajr: prayerTimes.fajr,
      sunrise: prayerTimes.sunrise,
      dhuhr: prayerTimes.dhuhr,
      asr: prayerTimes.asr,
      maghrib: prayerTimes.maghrib,
      isha: prayerTimes.isha,
    };
  }

  /**
   * Get formatted prayer times
   */
  getFormattedPrayerTimes(
    location: LocationCoordinates,
    date: Date = new Date()
  ) {
    const times = this.calculatePrayerTimes(location, date);

    return {
      Subh: this.formatTime(times.fajr),
      Dhuhr: this.formatTime(times.dhuhr),
      Asr: this.formatTime(times.asr),
      Maghrib: this.formatTime(times.maghrib),
      Isha: this.formatTime(times.isha),
      Tahajjud: this.calculateTahajjud(times.isha, times.fajr),
    };
  }

  /**
   * Calculate Tahajjud time (last third of the night)
   */
  private calculateTahajjud(isha: Date, fajr: Date): string {
    const ishaTime = isha.getTime();
    const fajrTime = fajr.getTime();
    
    // If fajr is on the next day
    let nightDuration = fajrTime - ishaTime;
    if (nightDuration < 0) {
      nightDuration += 24 * 60 * 60 * 1000; // Add 24 hours
    }

    // Last third of the night
    const tahajjudTime = new Date(ishaTime + (nightDuration * 2) / 3);
    
    return this.formatTime(tahajjudTime);
  }

  /**
   * Calculate forbidden prayer times
   */
  getForbiddenTimes(
    location: LocationCoordinates,
    date: Date = new Date()
  ): ForbiddenTimesResult {
    const times = this.calculatePrayerTimes(location, date);

    // Sunrise forbidden time: from sunrise to ~15 minutes after
    const sunriseEnd = new Date(times.sunrise.getTime() + 15 * 60 * 1000);

    // Noon forbidden time: ~10 minutes before Dhuhr to Dhuhr
    const noonStart = new Date(times.dhuhr.getTime() - 10 * 60 * 1000);

    // Sunset forbidden time: ~15 minutes before Maghrib to Maghrib
    const sunsetStart = new Date(times.maghrib.getTime() - 15 * 60 * 1000);

    return {
      sunriseStart: times.sunrise,
      sunriseEnd,
      noonStart,
      noonEnd: times.dhuhr,
      sunsetStart,
      sunsetEnd: times.maghrib,
    };
  }

  /**
   * Get formatted forbidden times
   */
  getFormattedForbiddenTimes(
    location: LocationCoordinates,
    date: Date = new Date()
  ) {
    const times = this.getForbiddenTimes(location, date);

    return [
      {
        period: 'Sunrise',
        start: this.formatTime(times.sunriseStart),
        end: this.formatTime(times.sunriseEnd),
        icon: 'sunrise',
      },
      {
        period: 'Noon',
        start: this.formatTime(times.noonStart),
        end: this.formatTime(times.noonEnd),
        icon: 'noon',
      },
      {
        period: 'Sunset',
        start: this.formatTime(times.sunsetStart),
        end: this.formatTime(times.sunsetEnd),
        icon: 'sunset',
      },
    ];
  }

  /**
   * Get Hijri/Islamic date
   */
  getIslamicDate(date: Date = new Date()): string {
    // Using Intl API for Islamic calendar
    try {
      const islamicDate = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(date);

      // Format to match your style: "29 Jumada al-Awwal | 1447AH"
      const parts = islamicDate.split(' ');
      if (parts.length >= 3) {
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        return `${day} ${month} | ${year}AH`;
      }

      return islamicDate;
    } catch (error) {
      console.error('Error formatting Islamic date:', error);
      return 'Islamic Date Unavailable';
    }
  }

  /**
   * Calculate Qibla direction
   */
  getQiblaDirection(location: LocationCoordinates): number {
    const coordinates = new Coordinates(
      location.latitude,
      location.longitude
    );
    return Qibla(coordinates);
  }

  /**
   * Get next prayer name and time
   */
  getNextPrayer(
    location: LocationCoordinates,
    date: Date = new Date()
  ): { name: string; time: Date } | null {
    const coordinates = new Coordinates(
      location.latitude,
      location.longitude
    );

    const params = CalculationMethod.MuslimWorldLeague();
    const prayerTimes = new AdhanPrayerTimes(coordinates, date, params);

    const nextPrayer = prayerTimes.nextPrayer(date);
    
    if (!nextPrayer) return null;

    const prayerNames: { [key: string]: string } = {
      [Prayer.Fajr]: 'Fajr',
      [Prayer.Sunrise]: 'Sunrise',
      [Prayer.Dhuhr]: 'Dhuhr',
      [Prayer.Asr]: 'Asr',
      [Prayer.Maghrib]: 'Maghrib',
      [Prayer.Isha]: 'Isha',
    };

    return {
      name: prayerNames[nextPrayer] || 'Unknown',
      time: prayerTimes.timeForPrayer(nextPrayer) || new Date(),
    };
  }
}

export default new PrayerService();