import { Injectable } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { IDispositionStatus } from './disposition-status.interface';

import { Plugins } from '@capacitor/core';
import { capSQLiteValues } from '@capacitor-community/sqlite';
import { switchMap } from 'rxjs/operators';
const { CapacitorSQLite, Device, Storage } = Plugins;
const DB_SETUP_KEY = 'first_db_setup';
const DB_NAME_KEY = 'db_name';


@Injectable({
  providedIn: 'root'
})
export class DbService {

  songsList = new BehaviorSubject([]);
  dbReady = new BehaviorSubject(false);
  dbName = '';

  constructor(
    private platform: Platform, 
    private alertCtrl: AlertController
  ) {}

  async init(): Promise<void> {
    const info = await Device.getInfo();
 
    if (info.platform === 'android') {
      try {
        const sqlite = CapacitorSQLite as any;
        await sqlite.requestPermissions();
        this.setupDatabase();
      } catch (e) {
        const alert = await this.alertCtrl.create({
          header: 'No DB access',
          message: 'This app can\'t work without Database access.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } else {
      this.setupDatabase();
    }
  }

  private async setupDatabase() {
    const dbSetupDone = await Storage.get({ key: DB_SETUP_KEY });
 
    if (!dbSetupDone.value) {
      this.downloadDatabase();
    } else {
      this.dbName = (await Storage.get({ key: DB_NAME_KEY })).value;
      await CapacitorSQLite.open({ database: this.dbName });
      this.dbReady.next(true);
    }
  }


  private async downloadDatabase(update = false) {
        this.dbName = 'appleSauce';
        await Storage.set({ key: DB_NAME_KEY, value: this.dbName });
        await Storage.set({ key: DB_SETUP_KEY, value: '1' });
 
        // Your potential logic to detect offline changes later
        if (!update) {
          await CapacitorSQLite.createSyncTable();
        } else {
          await CapacitorSQLite.setSyncDate({ syncdate: '' + new Date().getTime() })
        }
        this.dbReady.next(true);
  }
 
  fetchDispositions(): Observable<IDispositionStatus[]> {
    return this.songsList.asObservable();
  }

  // Get list
  getDispositions(): Observable<capSQLiteValues>{
    return this.dbReady.pipe(
        switchMap(isReady => {
          if (!isReady) {
            return of({ values: [] });
          } else {
            const statements = `select * from disposition limit 5`;
            return from(CapacitorSQLite.execute({ statements }));
          }
        })
    )
  }

  // Add
  addDisposition(data: IDispositionStatus): Observable<capSQLiteValues> {
    const { calledAt, isDisposed, leadId } = data;

    return this.dbReady.pipe(
        switchMap(isReady => {
          if (!isReady) {
            return of({ values: [] });
          } else {
            const statements = `INSERT INTO disposition (calledAt, isDisposed, leadId) VALUES (${calledAt}, ${isDisposed}, ${leadId});`;
            return from(CapacitorSQLite.execute({ statements }));
          }
        })
    )
  }
 
  // Get single object
  getDispositionById(id): Observable<capSQLiteValues> {
    return this.dbReady.pipe(
        switchMap(isReady => {
          if (!isReady) {
            return of({ values: [] });
          } else {
            const statement = 'SELECT * FROM disposition;';
            return from(CapacitorSQLite.query({ statement, values: [] }));
          }
        })
    )
  }

  // Update
  updateDispositionByLeadId(lead_id: string, disposition: Pick<IDispositionStatus, 'calledAt' | 'isDisposed'>): Observable<capSQLiteValues> {
    let {isDisposed, calledAt} = disposition;
    // const {rows} = await this.storage.executeSql(`UPDATE disposition SET leadId = ?, isDisposed = ? calledAt = ? WHERE leadId = ?`,
    //     [leadId, isDisposed, calledAt, leadId]);


    return this.dbReady.pipe(
        switchMap(isReady => {
          if (!isReady) {
            return of({ values: [] });
          } else {
            const statements = `UPDATE disposition SET isDisposed = ${isDisposed} calledAt = ${calledAt} WHERE leadId = ${lead_id};`;
            return from(CapacitorSQLite.execute({ statements }));
          }
        })
    )
  }

  // Delete
//   async deleteDispositionByLeadId(leadId): Promise<IDispositionStatus> {
//     const {rows} = await this.storage.executeSql('DELETE FROM disposition WHERE leadId = ?', [leadId]);

//     return rows.item(0);
//   }
}