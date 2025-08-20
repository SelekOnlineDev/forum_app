# ForumApp
Quantum Physics Forum

EN

About the project:
Quantum Physics Forum is a Q&A platform for discussions about quantum physics. The project uses the following technologies:
Backend: Node.js, ExpressJS, MongoDB, JWT authentication, UUID.
Frontend: React (Vite), React Router, Styled Components, Context API, Axios.
How to run the project:
Requirements:, Node.js (v18+), MongoDB access (local or MongoDB Atlas), npm.
1. Start the server
Download or clone the project:
bash
 git clone https://github.com/EimantasJaskonis/ForumApp.git
 cd quantum-forum/server
Install dependencies:
bash
 npm install

Create a .env file in the server directory with the following content:
env
 PORT=5500
 DB_USER=your_db_user
 DB_USER_PASSWORD=your_db_password
 DB_CLUSTER=your_cluster
 DB_CLUSTER_ID=your_cluster_id
 DB_NAME=quantum_forum
 JWT_SECRET=your_key
Start the server:
bash
 npm run dev
 The server will start on port 5500: http://localhost:5500

2. Launch the client
Open a new terminal window and go to the client directory:
bash
 cd ForumApp/client

Install dependencies:
 bash
 npm install

Run the client application:
bash
 npm run dev
 The client will run on port 5173: http://localhost:5173

Pages -> Services (api.js) -> Backend routes
Context (UserContext) used across Pages and Components
Atomic design: Atoms → Molecules → Organisms

1. Home Page: Home page with main links and forum introduction.
2. Forum: Question list with:
Search field
Filter buttons (All, Reply, Unanswered)
Sort buttons (Newest, Popular)
Question cards with number of answers
Pagination
3. Question Detail Page: Detailed view of the question with:
Question content
All answers
Option to add a new answer
Question author information
4. Ask Question: Form for creating a new question with:
Large text field for the question
Upload button
Cancel button
5. Login: Login form with:
Email Email field
Password field with toggled visibility
Login button
Link to registration page
6. Register: Registration form with:
Name field
Email field
Password field
Confirm password field
Registration button
Link to login page
7. User Profile: User profile page with:
Edit profile information form
Change password form
Save buttons



LT

Apie projektą:
Quantum Physics Forum yra klausimų-atsakymų platforma, skirta diskusijoms apie kvantinę fiziką. Projekte naudojama ši technologijų:
Backend: Node.js, ExpressJS, MongoDB, JWT autentifikacija, UUID.
Frontend: React (Vite), React Router, Styled Components, Context API, Axios.
Kaip paleisti projektą:
Reikalavimai:, Node.js (v18+), MongoDB prieiga (lokali arba MongoDB Atlas), npm.
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

Pages -> Services (api.js) -> Backend routes
Context (UserContext) used across Pages and Components
Atomic design: Atoms → Molecules → Organisms

1. Pagrindinis puslapis (Home): Pagrindinis puslapis su pagrindinėmis nuorodomis ir forumo pristatymu.
2. Forumas (Forum): Klausimų sąrašas su:
Paieškos laukeliu
Filtrų mygtukais (Visi, Atsakyti, Neatsakyti)
Rūšiavimo mygtukais (Naujausi, Populiarūs)
Klausimų kortelėmis su atsakymų skaičiumi
Puslapiavimu
3. Klausimo puslapis (Question Detail): Detalus klausimo rodinys su:
Klausimo turiniu
Visais atsakymais
Galimybe pridėti naują atsakymą
Klausimo autoriaus informacija
4. Klausimo uždavinėjimas (Ask Question): Forma naujam klausimui sukurti su:
Dideliu teksto lauku klausimui
Įkelimo mygtuku
Atšaukimo mygtuku
5. Prisijungimas (Login): Prisijungimo forma su:
El. pašto lauku
Slaptažodžio lauku su perjungiama matomumu
Prisijungimo mygtuku
Nuoroda į registracijos puslapį
6. Registracija (Register): Registracijos forma su:
Vardo lauku
El. pašto lauku
Slaptažodžio lauku
Slaptažodžio patvirtinimo lauku
Registracijos mygtuku
Nuoroda į prisijungimo puslapį
7. Vartotojo profilis (User Profile): Vartotojo profilio puslapis su:
Profilio informacijos redagavimo forma
Slaptažodžio keitimo forma
Išsaugojimo mygtukais
