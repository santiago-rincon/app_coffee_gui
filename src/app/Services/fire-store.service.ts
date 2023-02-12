import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, retry } from 'rxjs';

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

  getDataVariablesWithoutOrder(collection: string): Observable<any[]> {
    return this.firestore.collection(collection).snapshotChanges();
  }

  getDataThreshold(): Observable<any[]> {
    return this.firestore.collection('Umbrales').snapshotChanges();
  }

  getNodes(): Observable<any[]> {
    return this.firestore.collection('Nodos').snapshotChanges();
  }

  getLastData(collection: string): Observable<any[]> {
    return this.firestore
      .collection(collection, (ref) =>
        ref.orderBy('dateAndTime', 'desc').limit(1)
      )
      .snapshotChanges();
  }

  updateData(id: string, data: any, colecction: string) {
    return this.firestore.collection(colecction).doc(id).update(data);
  }

  deleteData(id: string, colecction: string) {
    return this.firestore.collection(colecction).doc(id).delete();
  }

  putData(data:any, collection:string){
    return this.firestore.collection(collection).doc().set(data)
  }

  // arrayFilter(array: any[], date: string): any[] {
  //   const filter = array.filter((element, index) => {
  //     return element.date === date;
  //   });
  //   return filter
  // }
}
