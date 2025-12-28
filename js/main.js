// Funzione di utilità per l'Exponential Backoff
const delay = ms => new Promise(res => setTimeout(res, ms));

// === URL del Web App di Google Apps Script (inserito automaticamente) ===
// ATTENZIONE: il SECRET è visibile nel sorgente della pagina. Per sicurezza migliore usare un backend.
const SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbzrKEYeE4HodlTOahGrAkgLnjPv3O1xWmsPjnNU_KeqOAI8H7jBWEpIK7FCYdJISvh_/exec";
const SHEET_SECRET = "AKfycbzrKEYeE4HodlTOahGrAkgLnjPv3O1xWmsPjnNU_KeqOAI8H7jBWEpIK7FCYdJISvh_"; // opzionale: verifica lato Apps Script

/**
 * Chiama l'API di generazione immagini e aggiorna l'elemento specificato.
 */
async function generateAndSetImage(prompt, elementId, loaderId, isBackground = false) {
  const element = document.getElementById(elementId);
  const loader = loaderId ? document.getElementById(loaderId) : null;
  if (!element) return;
  
  const apiKey = ""; 
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`;
  
  if (loader) loader.style.display = 'block';

  const payload = { 
    instances: [{ prompt: prompt }], 
    parameters: { "sampleCount": 1 } 
  };

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const base64Data = result?.predictions?.[0]?.bytesBase64Encoded;

      if (base64Data) {
        const imageUrl = `data:image/png;base66,${base64Data}`;
        if (isBackground) {
          element.style.backgroundImage = `url('${imageUrl}')`;
        } else {
          element.src = imageUrl;
          element.style.opacity = 1;
        }
        if (loader) loader.style.display = 'none';
        return;
      }
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed for ${elementId}:`, error);
      if (attempt < 4) {
        await delay(Math.pow(2, attempt) * 1000); // Exponential Backoff
      } else {
        if (loader) loader.style.display = 'none';
        if (!isBackground) element.alt = `Errore caricamento immagine: ${prompt}`;
      }
    }
  }
}


// Esecuzione delle chiamate per le immagini
function loadGeneratedImages() {
    // 1. Sfondo Hero Section
    generateAndSetImage(
        "A high-quality, cinematic shot of a vibrant Italian football stadium atmosphere at night, viewed from the stands, with a subtle digital overlay showing streaming content icons. Focus on excitement and premium quality.",
        'heroBackground', 
        null, 
        true 
    );

    // 2. Galleria UI Menu Sport
    generateAndSetImage(
        "A modern, clean TV streaming application user interface (UI) screen showing a 'Sports Menu.' The design is minimal, using a white background, black text, and red accents. Show list of sport categories like Football, F1, Tennis.",
        'imgSport', 
        'loaderSport', 
        false
    );

    // 3. Galleria UI Guida EPG
    generateAndSetImage(
        "A modern, clean TV streaming application user interface (UI) screen showing a detailed Electronic Program Guide (EPG). The design is minimal, using a white background, black text, and red accents. Show a timeline of live TV channels.",
        'imgEPG', 
        'loaderEPG', 
        false
    );

    // 4. Galleria - Logo Campionato del Mondo FIFA 2026 
    generateAndSetImage(
        "A high-quality 3D render of the official FIFA World Cup 2026 logo, featuring the stylized '26' and the trophy, set against a dark, metallic background. Focus on the official logo colors and details.",
        'imgVOD', 
        'loaderVOD', 
        false
    );

    // 5. Galleria - Logo Coppa d'Africa 2025 Marocco
    generateAndSetImage(
        "A high-quality 3D render of the official CAF Africa Cup of Nations Morocco 2025 logo. Focus on the official colors, the stylized cup, and the Moroccan and African design elements.",
        'imgLive', 
        'loaderLive', 
        false
    );
}

// --- LOGICA MODALE TIFO ANALYZER (GEMINI API) ---

function openAnalyzerModal() {
    document.getElementById('analyzerModal').style.display = 'block';
}

function closeAnalyzerModal() {
    document.getElementById('analyzerModal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('analyzerModal');
    if (event.target === modal) {
        closeAnalyzerModal();
    }
}

/**
 * Chiama l'API Gemini per l'analisi della query.
 */
async function analyzeQuery() {
    const queryInput = document.getElementById('analyzerQueryInput');
    const responseDiv = document.getElementById('analyzerResponse');
    const sourcesDiv = document.getElementById('analyzerSources');
    const analyzeButton = document.getElementById('analyzeButton');
    const userQuery = queryInput.value.trim();

    if (!userQuery) {
        responseDiv.innerHTML = '<p style="color:red; text-align:center;">Per favore, inserisci una domanda valida.</p>';
        sourcesDiv.style.display = 'none';
        return;
    }

    const systemPrompt = "Sei Tifo Analyzer, un assistente AI amichevole, conciso e molto esperto in servizi IPTV premium e sport. Rispondi in italiano. Se la domanda è sui servizi TIFOZERIA, basati sui piani descritti: Tifo Starter (49.99€/12 Mesi, HD, Sport Completo, VOD Essenziale), Tifo Power (89.99€/48 Mesi, 4K UHD, Sport Completo, VOD Illimitato, Assistenza Prioritaria), Tifo Tantom (199.99€/Illimitato, 4K, Esclusive, Assistenza a Vita). Se la domanda è su eventi sportivi attuali, usa le tue conoscenze aggiornate tramite Google Search.";
    
    // Visualizza lo stato di caricamento
    responseDiv.innerHTML = '<div class="loader" style="position:relative; transform:none; left:auto; top:auto; margin: 20px auto;"></div><p style="text-align:center; margin-top:10px;">Analisi in corso... attendi.</p>';
    analyzeButton.disabled = true;
    analyzeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analizzando...';
    sourcesDiv.style.display = 'none';

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    // Costruzione del payload con Google Search Grounding
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        // Abilita Google Search per domande in tempo reale
        tools: [{ "google_search": {} }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
    };

    for (let attempt = 0; attempt < 5; attempt++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const candidate = result.candidates?.[0];

            if (candidate && candidate.content?.parts?.[0]?.text) {
                const text = candidate.content.parts[0].text;
                let sources = [];
                const groundingMetadata = candidate.groundingMetadata;

                if (groundingMetadata && groundingMetadata.groundingAttributions) {
                    sources = groundingMetadata.groundingAttributions
                        .map(attribution => ({
                            uri: attribution.web?.uri,
                            title: attribution.web?.title,
                        }))
                        .filter(source => source.uri && source.title)
                        .slice(0, 3); // Limita a 3 fonti per la pulizia UI
                }

                // Aggiorna l'interfaccia
                responseDiv.innerHTML = `<strong>Risposta:</strong><br>${text.replace(/\n/g, '<br>')}`;
                
                if (sources.length > 0) {
                    sourcesDiv.innerHTML = '<strong>Fonti (Gemini Search):</strong>';
                    sources.forEach((source, index) => {
                        sourcesDiv.innerHTML += ` <a href="${source.uri}" target="_blank">(${index + 1}) ${source.title}</a>`;
                    });
                    sourcesDiv.style.display = 'block';
                } else {
                    sourcesDiv.style.display = 'none';
                }

                // Ripristina lo stato del pulsante e dell'input
                analyzeButton.disabled = false;
                analyzeButton.innerHTML = '<i class="fas fa-paper-plane"></i> Analizza e Rispondi';
                // Non pulire l'input per permettere modifiche veloci, a meno che non sia l'analyzer
                if (queryInput.id !== 'analyzerQueryInput') {
                    queryInput.value = ''; 
                }
                return; // Successo, esci dal ciclo
            }
        } catch (error) {
            console.error(`Tentativo ${attempt + 1} fallito per Gemini Analyzer:`, error);
            if (attempt === 4) {
                responseDiv.innerHTML = '<p style="color:red; text-align:center;">Errore di connessione. Riprova più tardi.</p>';
            }
            await delay(Math.pow(2, attempt) * 1000); // Backoff
        }
    }

    // Ripristina lo stato finale in caso di tutti i fallimenti
    analyzeButton.disabled = false;
    analyzeButton.innerHTML = '<i class="fas fa-paper-plane"></i> Analizza e Rispondi';
    sourcesDiv.style.display = 'none';
}


// Inizializza tutto al caricamento della pagina
window.onload = function() {
    loadGeneratedImages();
}


// --- LOGICA DI NAVIGAZIONE ---

// Gestione Menu Mobile
const navLinks = document.querySelector('.nav-links');
const menuToggle = document.getElementById('menuToggle');

function toggleMobileMenu() {
    navLinks.classList.toggle('open');
    const icon = menuToggle.querySelector('i');
    if (navLinks.classList.contains('open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

function closeMobileMenu() {
    // Chiude il menu mobile se è aperto (solo su schermi piccoli)
    if (window.innerWidth <= 768 && navLinks.classList.contains('open')) {
        setTimeout(toggleMobileMenu, 100); // Piccolo ritardo per permettere il click
    }
}

// Gestione Scorrimento Menu Fisso (cambio colore)
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-links a');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 100) {
        nav.classList.add('scrolled');
        // Cambia i colori dei link quando scrollato (da bianco a nero)
        navLinks.forEach(link => {
            link.style.color = link.classList.contains('action-cta') ? 'white' : 'var(--dark-text)';
        });
    } else {
        nav.classList.remove('scrolled');
        // Riporta i colori dei link a bianco quando è in cima all'Hero
        navLinks.forEach(link => {
            link.style.color = link.classList.contains('action-cta') ? 'white' : 'white';
        });
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  const elementVisible = 150;
  
  revealElements.forEach((reveal) => {
    const elementTop = reveal.getBoundingClientRect().top;
    if (elementTop < windowHeight - elementVisible) {
      reveal.classList.add('active');
    }
  });
};
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// FAQ Accordion
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
  question.addEventListener('click', () => {
    question.classList.toggle('active');
    const answer = question.nextElementSibling;
    const icon = question.querySelector('i');
    
    // Chiudi tutti gli altri
    document.querySelectorAll('.faq-question.active').forEach(q => {
        if (q !== question) {
            q.classList.remove('active');
            q.nextElementSibling.style.maxHeight = null;
            q.querySelector('i').style.transform = 'rotate(0deg)';
        }
    });
    
    if (answer.style.maxHeight) {
      answer.style.maxHeight = null;
      icon.style.transform = 'rotate(0deg)';
    } else {
      answer.style.maxHeight = answer.scrollHeight + 40 + "px"; 
      icon.style.transform = 'rotate(180deg)';
    }
  });
});

// Select Plan Helper
function selectPlan(planValue) {
  const selector = document.getElementById('planSelector');
  const option = Array.from(selector.options).find(opt => opt.value.startsWith(planValue));
  if (option) {
    selector.value = option.value;
  }
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

// Form Submit: invia i dati al Google Sheet tramite Apps Script Web App (POST)
document.getElementById('orderForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const submitButton = form.querySelector('.btn');

  const name = form.querySelector('input[type="text"]').value.trim();
  const email = form.querySelector('input[type="email"]').value.trim();
  const whatsapp = form.querySelector('input[type="tel"]').value.trim();
  const plan = document.getElementById('planSelector').value;
  const notes = form.querySelector('textarea').value.trim();

  const payload = {
    name,
    email,
    whatsapp,
    plan,
    notes,
    timestamp: new Date().toISOString(),
    secret: SHEET_SECRET
  };

  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inviando...';

  try {
    const orderError = document.getElementById('orderError');
    if (orderError) { orderError.style.display = 'none'; orderError.textContent = ''; }

    if (!SHEET_WEBAPP_URL) throw new Error('SHEET_WEBAPP_URL non impostato. Inserisci l\'URL del Web App in `SHEET_WEBAPP_URL`.');

    const res = await fetch(SHEET_WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      // Tentativo di leggere il corpo della risposta per capire l'errore
      let bodyText = '';
      try { bodyText = await res.text(); } catch (e) { bodyText = '<no body>'; }
      const msg = `Server returned ${res.status}: ${bodyText}`;
      console.error(msg);
      if (orderError) { orderError.textContent = msg; orderError.style.display = 'block'; }
      throw new Error(msg);
    }

    // opzionale: leggere corpo JSON di risposta se il Web App lo restituisce
    try { await res.json(); } catch (_) {}

    submitButton.innerHTML = '<i class="fas fa-check"></i> RICEVUTO!';
    submitButton.style.backgroundColor = '#25D366';
    form.reset();
    document.getElementById('planSelector').value = 'Tifo Power';

  } catch (err) {
    console.error('Errore invio ordine:', err);
    const orderError = document.getElementById('orderError');
    if (orderError) {
      orderError.textContent = err.message || 'Errore invio ordine';
      orderError.style.display = 'block';
    }
    submitButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Errore invio';
    // Mantieni il messaggio visibile e poi ripristina il bottone
    setTimeout(() => {
      submitButton.innerHTML = 'CONFERMA ORDINE';
      submitButton.style.backgroundColor = 'var(--primary-red)';
      submitButton.disabled = false;
    }, 3000);
    return;
  }

  // Ripristina lo stato del bottone dopo conferma visiva
  setTimeout(() => {
    submitButton.innerHTML = 'CONFERMA ORDINE';
    submitButton.style.backgroundColor = 'var(--primary-red)';
    submitButton.disabled = false;
  }, 3000);
});
