import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private baseUrl = 'https://countriesnow.space/api/v0.1';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<string[]> {
    return this.http.get<any>(`${this.baseUrl}/countries`)
      .pipe(
        map(response => response.data.map((country: any) => country.iso2))
      );
  }

  getStates(country: string): Observable<string[]> {
    const url = 'https://countriesnow.space/api/v0.1/countries/states';
    
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json; charset=utf-8');
    
    // Important: The API expects the country in uppercase
    const requestBody = { country: country };

    return this.http.post<any>(url, {country: "IN"}, { headers }).pipe(
        tap(response => console.log('API Response:', response)),
        map(response => {
            if (response && response.data && response.data.states) {
                return response.data.states.map((state: any) => state.name);
            }
            return [];
        }),
        catchError(error => {
            console.error('API Error:', error);
            return throwError(() => new Error('Failed to load states'));
        })
    );
}

  getCitiesByState(country: string, state: string): Observable<string[]> {
    return this.http.post<any>(`${this.baseUrl}/countries/state/cities`, {
      country: country,
      state: state
    }).pipe(
      map(response => response.data)
    );
  }

  getCurrencies(): Observable<string[]> {
    return this.http.get<any>(`${this.baseUrl}/countries/currency`)
      .pipe(
        map(response => {
          const currencies = new Set<string>();
          response.data.forEach((item: any) => {
            currencies.add(item.currency);
          });
          return Array.from(currencies);
        })
      );
  }
}