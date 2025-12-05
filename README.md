# 🎵 NIRD - Lycée Ada Lovelace

![Nuit de l'Info 2025](https://img.shields.io/badge/Nuit%20de%20l'Info-2025-purple?style=for-the-badge&logo=moon)
![Team Devier](https://img.shields.io/badge/Équipe-Devier-green?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/HTML5-CSS3-JavaScript-blue?style=for-the-badge)

> **Projet réalisé dans le cadre de la Nuit de l'Info 2025 par des étudiants en BUT Informatique de l'Université de Toulouse.**

NIRD est un site web narratif et interactif conçu pour le fictif **Lycée Ada Lovelace**. Le projet combine une narration visuelle sur les enjeux du numérique (migration vers Linux, open-source) et une expérience sensorielle via un visualiseur audio avancé.

---

## ⚠️ Avertissement de Compatibilité (Audio)

### 🚨 **Problème connu avec Mozilla Firefox**

Le module de visualisation audio "Mode Audio PC" utilise l'API moderne `navigator.mediaDevices.getDisplayMedia`.

Actuellement, **Firefox ne supporte pas la capture de l'audio système** (le son sortant de votre ordinateur) via cette API sous Windows. Par conséquent, si vous utilisez Firefox :
* Le visualiseur fonctionnera avec la musique d'ambiance intégrée.
* **Le bouton "Mode Audio PC" ne pourra pas capturer le son de vos autres applications (Spotify, YouTube, etc.).**

👉 **Recommandation :** Pour une expérience optimale et pour tester la réactivité du visualiseur sur vos propres musiques, **veuillez utiliser Google Chrome, Microsoft Edge ou Brave (duckduckgo aussi).**

---

## ✨ Fonctionnalités Principales

### 1. 🎨 Visualiseur Audio Interactif (Canvas API)
La page d'accueil propose une expérience immersive développée en Vanilla JS (sans librairie externe) :
* **Particules Réactives :** Des centaines de billes réagissent à la souris (effet de répulsion/vortex) et au rythme de la musique.
* **Analyse de Fréquence :** Utilisation de l'API *Web Audio* pour analyser les fréquences (Bass Kick) et faire pulser les particules en temps réel.
* **Mode "Audio PC" 📡 :** Permet à l'utilisateur de visualiser le son sortant de son propre ordinateur en partageant l'audio de son système (Chrome/Edge uniquement).

### 2. 📖 Narration Interactive
Une série de pages (`débutHistoire.html`, etc.) raconte l'histoire d'Alice et Robert, abordant des thématiques liées à l'obsolescence logicielle et la migration vers des systèmes libres au sein du lycée.
* Interface "Glassmorphism" pour une esthétique moderne.
* Navigation fluide via un menu burger responsive.

### 3. 🐱 Chatbot "Moustache"
Un compagnon virtuel est intégré en bas de page pour accompagner l'utilisateur (du mieux qu'il pourra, du haut de ses plumes et croquettes).

---

## 🚀 Installation et Utilisation

Ce projet est un site statique (HTML/CSS/JS). Aucune installation complexe (npm, node) n'est requise.

## 🛠️ Technologies Utilisées

* **HTML5** : Structure sémantique.
* **CSS3** : Flexbox, Grid, Animations, Variables CSS, Backdrop-filter (Glassmorphism).
* **JavaScript (ES6+)** :
    * **Canvas API** : Dessin et animation des particules.
    * **Web Audio API** : Analyseur FFT (Fast Fourier Transform), GainNode, MediaStreamSource.
    * **MediaDevices API** : Capture d'écran et d'audio système.

---

## 👥 L'Équipe Devier

Un grand merci à toute l'équipe ayant travaillé sur ce projet durant cette nuit blanche :

| Membre | Rôle |
| :--- | :--- |
| **Joseph LALOT** | Développeur |
| **Victor SIMONET** | Développeur |
| **Ilyas TURMINE** | Développeur |
| **Unai MURILLO** | Développeur |
| **Guillaume BOURNAZEL-LOTY** | Développeur |
| **Lucas FERNANDES** | Développeur |
| **Rémi SAGNES** | Développeur / Chef d'équipe|
| **Anaïs DUVAL** | Développeur  |
| **Elliot ISKEN--ANDERSEN NEXO** | Développeur |
| **Eulalie FRAYSSE** | Développeur |

---

## 📄 Licence & Contexte

Ce projet a été créé à des fins éducatives et compétitives pour la **Nuit de l'Info 2025**.
*Lycée Ada Lovelace est une entité fictive créée pour les besoins du défi.*

© 2025 Équipe Devier - Tous droits réservés.