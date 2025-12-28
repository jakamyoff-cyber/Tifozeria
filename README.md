# TIFOZERIA - IPTV Premium Italia

Sito web professionale per la piattaforma IPTV **TIFOZERIA**, specializzata in trasmissione di sport e contenuti in diretta.

## 📋 Struttura del Progetto

```
/Tifozeria
├── index.html           # File HTML principale
├── css/
│   └── style.css       # Fogli di stile (tema rosso/nero)
├── js/
│   └── main.js         # Logica JavaScript (interattività)
├── README.md           # Questo file
└── .git/               # Repository Git
```

## ✨ Caratteristiche Principali

### 1. **Hero Section Dinamica**
- Background immagine generato con AI (Gemini API)
- Navigazione fissa con effetto scroll
- CTA prominenti per la conversione

### 2. **Ticker VOD Animato**
- Barra rossa fissa in alto con notizie aggiornate
- Animazione scroll continua

### 3. **Sezioni Principali**
- **Vantaggi**: 4 box con icone (15K canali, Server Anti-Freeze, Supporto 24/7, VOD Aggiornato)
- **Piani Abbonamento**: 3 opzioni con prezzi chiari (Starter, Power, Tantom)
- **Galleria**: 4 preview immagini generate con AI
- **FAQ**: Accordion interattivo con 4 domande comuni
- **Form Ordine**: Raccolta dati con integrazione Google Sheets

### 4. **Tifo Analyzer** (Intelligenza Artificiale)
- Modal con AI (Gemini API)
- Risposte su piani TIFOZERIA o notizie sportive in tempo reale
- Integrazione Google Search grounding

### 5. **Responsive Design**
- Mobile-first approach
- Menu hamburger su dispositivi piccoli
- Adattamento automatico di layout e font

### 6. **Integrazioni**
- **FontAwesome**: Icone professionali
- **Google Fonts (Inter)**: Tipografia moderna
- **Gemini API**: Generazione immagini e risposte AI
- **Google Apps Script**: Salvataggio ordini in Google Sheets
- **WhatsApp**: Bottone floating per contatti diretti

## 🎨 Design & Tema

- **Colore Primario**: Rosso vivo (#E60000)
- **Font**: Inter (Sans-serif moderno)
- **Palette**: Rosso, bianco, grigio scuro
- **Effetti**: Gradient overlays, smooth scrolling, reveal animations

## 🔧 Tecnologie Utilizzate

- **HTML5** - Struttura semantica
- **CSS3** - Styling responsivo con media queries
- **JavaScript (Vanilla)** - Interattività senza framework
- **Google Generative AI** - Immagini e chat
- **Google Sheets API** - Database ordini
- **FontAwesome 6** - Icon library

## 📱 Responsive Breakpoints

- **Desktop**: 1200px max-width
- **Tablet**: Fino a 768px
- **Mobile**: Layout stack verticale, menu hamburger

## 🚀 Deployment

1. Carica i file su un hosting web (Netlify, GitHub Pages, Vercel, ecc.)
2. Configura le **API Keys**:
   - Gemini API Key per immagini e chat
   - Google Apps Script Web App URL per gli ordini
3. Test completo su desktop e mobile

## 📝 Configurazione API

### Gemini API (Immagini e Chat)
1. Vai su [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Genera una nuova API Key
3. Sostituisci in `js/main.js`:
   ```javascript
   const apiKey = "TUA_API_KEY_QUI";
   ```

### Google Apps Script (Salvataggio Ordini)
1. Crea un nuovo Google Sheet
2. Configura Apps Script per ricevere POST
3. Inserisci l'URL in `js/main.js`:
   ```javascript
   const SHEET_WEBAPP_URL = "TUO_WEB_APP_URL_QUI";
   ```

## 🎯 Piani Disponibili

1. **Tifo Starter** - 49,99€/12 Mesi
   - HD, Sport Completo, VOD Essenziale

2. **Tifo Power** - 89,99€/48 Mesi (Consigliato)
   - 4K UHD, Sport Premium, VOD Illimitato, Assistenza Prioritaria

3. **Tifo Tantom** - 199,99€/Illimitato
   - 4K, Esclusive, Aggiornamenti a Vita

## 📞 Supporto

- **WhatsApp**: Link floating in basso a destra
- **Email**: Dalla sezione ordine
- **Chat AI**: Tifo Analyzer modal

## 📄 Licenza

Tutti i diritti riservati © 2025 TIFOZERIA Italia.

---

**Sviluppato con ❤️ da GitHub Copilot**
