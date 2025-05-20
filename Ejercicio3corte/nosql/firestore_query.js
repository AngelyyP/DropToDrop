import { db } from './firebase_init.js';
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    startAt,
    endAt,
    getDocs
} from 'firebase/firestore';

export class FirestoreQuery {
    constructor(collectionName) {
        this.collectionRef = collection(db, collectionName);
    }

    async whereQuery(column, comparison, value) {
        const q = query(this.collectionRef, where(column, comparison, value));
        return this.runQuery(q);
    }

    async orderedQuery(column, direction = 'asc') {
        const q = query(this.collectionRef, orderBy(column, direction));
        return this.runQuery(q);
    }

    async limitedQuery(maxResults = 5) {
        const q = query(this.collectionRef, limit(maxResults));
        return this.runQuery(q);
    }

    async combinedQuery(filters = [], order = null, maxResults = null) {
        let constraints = filters.map(f => where(f.column, f.comparison, f.value));

        if (order) {
            constraints.push(orderBy(order.column, order.direction || 'asc'));
        }

        if (maxResults) {
            constraints.push(limit(maxResults));
        }

        const q = query(this.collectionRef, ...constraints);
        return this.runQuery(q);
    }

    async prefixSearch(column, prefix) {
        const endText = prefix + '\uf8ff';
        const q = query(
            this.collectionRef,
            orderBy(column),
            startAt(prefix),
            endAt(endText)
        );
        return this.runQuery(q);
    }

    async runQuery(q) {
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('No matching documents.');
            return [];
        }

        const results = [];
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            results.push({ id: doc.id, ...doc.data() });
        });
        return results;
    }
    
}
import { FirestoreQuery } from './nosql/firestore_query.js';

export async function mostrarPerfiles() {
  const fq = new FirestoreQuery('employers'); // Cambia el nombre si tu colección es diferente
  const perfiles = await fq.limitedQuery(10);

  const lista = document.getElementById('listaPerfiles');
  lista.innerHTML = '';

  if (perfiles.length === 0) {
    lista.innerHTML = '<p>No hay perfiles registrados.</p>';
    return;
  }

  perfiles.forEach(perfil => {
    const div = document.createElement('div');
    div.style.marginBottom = '10px';
    div.style.padding = '10px';
    div.style.background = '#333';
    div.style.borderRadius = '5px';
    div.innerHTML = `
      <strong>Nombre:</strong> ${perfil.nombre || ''}<br>
      <strong>Apellido:</strong> ${perfil.apellido || ''}<br>
      <strong>Edad:</strong> ${perfil.edad || ''}
    `;
    lista.appendChild(div);
  });
}