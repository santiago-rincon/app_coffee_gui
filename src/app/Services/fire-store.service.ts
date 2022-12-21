import { Injectable } from '@angular/core';
import { AngularFirestore,CollectionReference, fromCollectionRef } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FireStoreService {
  constructor(private firestore: AngularFirestore) {}

  getDataVariables(collection: string): Observable<any[]> {
    return this.firestore
      .collection(collection, (ref) => ref.orderBy('dateAndTime', 'desc'))
      .snapshotChanges();
  }

  getDataThreshold(): Observable<any[]> {
    return this.firestore.collection('Umbrales').snapshotChanges();
  }

  arrayFilter(array: any[], date: string): any[] {
    const filter = array.filter((element, index) => {
      return element.date === date;
    });
    return filter
  }
}
