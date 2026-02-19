import { initializeApp } from "https://www.gstatic.com";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com";
import { getDatabase, ref, get, set, onValue, update } from "https://www.gstatic.com";

const firebaseConfig = {
    apiKey: "AIzaSyCop4EVQ0Nfpwq0aRtgbQemxMVD626vP00",
    authDomain: "siapi-74d6d.firebaseapp.com",
    databaseURL: "https://siapi-74d6d-default-rtdb.firebaseio.com",
    projectId: "siapi-74d6d",
    storageBucket: "siapi-74d6d.firebasestorage.app",
    messagingSenderId: "1049903654521",
    appId: "1:1049903654521:web:a267a58ba793e8d09916a8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const provider = new GoogleAuthProvider();

let vpnTime = 0, watchTimer = null, clickCount = 0;

export async function login() {
    try {
        const res = await signInWithPopup(auth, provider);
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('main-hub').style.display = 'block';
        const userRef = ref(database, 'users/' + res.user.uid);
        onValue(userRef, (s) => {
            const d = s.val() || {solde:0, vpn:{time:0}};
            document.getElementById('user-balance-fcf').innerText = (d.solde || 0) + " FCFA";
            vpnTime = d.vpn?.time || 0;
        });
    } catch (e) { alert("Erreur d'authentification Google."); }
}

export function playMedia(url, title) {
    if(vpnTime <= 0) return alert("Veuillez charger le VPN ! 🛡️");
    document.getElementById('main-player').src = url;
    document.getElementById('player-screen').classList.add('active');
    let sec = 0;
    watchTimer = setInterval(async () => {
        sec++;
        document.getElementById('reward-timer').innerText = `Gain dans ${60-sec}s...`;
        if(sec >= 60) {
            clearInterval(watchTimer);
            const r = ref(database, `users/${auth.currentUser.uid}/solde`);
            const s = await get(r);
            await set(r, (s.val() || 0) + 10);
            alert("+10 FCFA ! 💰");
        }
    }, 1000);
}

export function closePlayer() {
    clearInterval(watchTimer);
    document.getElementById('main-player').src = "";
    document.getElementById('player-screen').classList.remove('active');
}

export async function regarderPubVPN() {
    if(window.show_8884441) window.show_8884441();
    vpnTime += 720;
    await update(ref(database, `users/${auth.currentUser.uid}/vpn`), { time: vpnTime });
}

export function demanderRetrait() {
    const s = document.getElementById('user-balance-fcf').innerText;
    window.open(`https://wa.me SIAPI de ${auth.currentUser.displayName} : ${s}`, '_blank');
}

export function secretClick() {
    clickCount++;
    if(clickCount === 5 && auth.currentUser.email === "abdoulk.diodoi@gmail.com") {
        const p = prompt("CODE MASTER :");
        if(p === "2026") alert("Accès Admin Débloqué !");
    }
}

