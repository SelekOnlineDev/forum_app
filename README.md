# ForumApp
Quantum Physics Forum

Apie projektą:
Quantum Physics Forum yra klausimų-atsakymų platforma, skirta diskusijoms apie kvantinę fiziką. Projekte naudojama ši technologijų:

Backend:
 Node.js
 Express
 MongoDB
 JWT autentifikacija
 UUID

Frontend:
 React (Vite)
 React Router
 Styled Components
 Context API
 Axios

Kaip paleisti projektą

Reikalavimai
 Node.js (v18+)
 MongoDB prieiga (lokali arba MongoDB Atlas)
 npm

1. Serverio paleidimas
Atsisiųskite arba nuklonuokite projektą:

bash
 git clone https://github.com/EimantasJaskonis/ForumApp.git
 cd quantum-forum/server

Įdiekite priklausomybes:

bash
 npm install

Sukurkite .env failą serverio kataloge su šiuo turiniu:

env
 PORT=5500
 DB_USER=jūsų_db_vartotojas
 DB_USER_PASSWORD=jūsų_db_slaptažodis
 DB_CLUSTER=jūsų_klasteris
 DB_CLUSTER_ID=jūsų_klasterio_id
 DB_NAME=quantum_forum
 JWT_SECRET=jūsų_raktas

Paleiskite serverį:

bash
 npm run dev
 Serveris pasileis ant 5500 porto: http://localhost:5500

2. Kliento paleidimas
Atidarykite naują terminalo langą ir eikite į kliento katalogą:

bash
 cd ForumApp/client

Įdiekite priklausomybes:

bash
 npm install
 
Paleiskite kliento aplikaciją:

bash
 npm run dev
 Klientas pasileis ant 5173 porto: http://localhost:5173

Projekto struktūra:

SERVER
------
server/
│
├── controllers/
│   ├── userController.js
│   ├── questionController.js
│   └── answerController.js
│
├── middleware/
│   └── authMiddleware.js
│
├── routes/
│   ├── userRoutes.js
│   ├── questionRoutes.js
│   └── answerRoutes.js
│
├── hashPasswords.js
├── index.js
├── .env
├── users.json
├── questions.json
└── answers.json

CLIENT
------
client/
│
├── public/
│
├── src/
│   ├── assets/
│
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Button.jsx
│   │   │   └── Input.jsx
│   │   │
│   │   ├── molecules/
│   │   │   ├── Alert.jsx
│   │   │   ├── InputField.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── PasswordField.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── TimeoutModal.jsx
│   │   │
│   │   └── organisms/
│   │       ├── Footer.jsx
│   │       ├── Header.jsx
│   │       └── QuestionCard.jsx
│   │
│   ├── context/
│   │   └── UserContext.jsx
│   │
│   ├── pages/
│   │   ├── Ask.jsx
│   │   ├── Forum.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── QuestionDetail.jsx
│   │   ├── Register.jsx
│   │   └── User.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── vite.config.js
└── package.json

Pages -> Services (api.js) -> Backend routes
Context (UserContext) used across Pages and Components
Atomic design: Atoms → Molecules → Organisms

1. Pagrindinis puslapis (Home)

Pagrindinis puslapis su pagrindinėmis nuorodomis ir forumo pristatymu.

2. Forumas (Forum)

Klausimų sąrašas su:

Paieškos laukeliu
Filtrų mygtukais (Visi, Atsakyti, Neatsakyti)
Rūšiavimo mygtukais (Naujausi, Populiarūs)
Klausimų kortelėmis su atsakymų skaičiumi
Puslapiavimu

3. Klausimo puslapis (Question Detail)

Detalus klausimo rodinys su:

Klausimo turiniu
Visais atsakymais
Galimybe pridėti naują atsakymą
Klausimo autoriaus informacija

4. Klausimo uždavinėjimas (Ask Question)

Forma naujam klausimui sukurti su:

Dideliu teksto lauku klausimui
Įkelimo mygtuku
Atšaukimo mygtuku

5. Prisijungimas (Login)

Prisijungimo forma su:
El. pašto lauku
Slaptažodžio lauku su perjungiama matomumu
Prisijungimo mygtuku
Nuoroda į registracijos puslapį

6. Registracija (Register)

Registracijos forma su:

Vardo lauku
El. pašto lauku
Slaptažodžio lauku
Slaptažodžio patvirtinimo lauku
Registracijos mygtuku
Nuoroda į prisijungimo puslapį

7. Vartotojo profilis (User Profile)

Vartotojo profilio puslapis su:

Profilio informacijos redagavimo forma
Slaptažodžio keitimo forma
Išsaugojimo mygtukais