<h1 align="center" style="font-weight: bold;">Daily diet control 🥗</h1>

<p align="center">
 <a href="#technologies">Technologies</a> • 
 <a href="#description">Description</a> • 
 <a href="#installation">Installation</a> •
 <a href="#endpoints">API Endpoints</a> •
 <a href="#autor">Autor</a> •
 <a href="#contribute">Contribute</a> •
 <a href="#license">License</a>
</p>

<h2 id="technologies">💻 Technologies</h2>

![Static Badge](https://img.shields.io/badge/typescript%20-%20%233178C%20?style=for-the-badge&logo=typescript&color=%23000000) ![Static Badge](https://img.shields.io/badge/fastify%20-%20%23000000?style=for-the-badge&logo=fastify&color=%23000000) ![Static Badge](https://img.shields.io/badge/knex%20-%20%23D26B38?style=for-the-badge&logo=knexdotjs&color=%23000000) ![Static Badge](https://img.shields.io/badge/zod%20-%20%233E67B1?style=for-the-badge&logo=zod&logoColor=%233E67B1&color=%23000000) ![Static Badge](https://img.shields.io/badge/sqlite%20-%20%233E67B1?style=for-the-badge&logo=sqlite&logoColor=%233E67B1&color=%23000000) ![Static Badge](https://img.shields.io/badge/vitest%20-%20%236E9F18?style=for-the-badge&logo=vitest&logoColor=%236E9F18&color=%23000000)

<h2 id="description">📚 Description</h2>

This application aims to help users control their daily diets by allowing them to record and track their meals. With it, users can create an account and, after logging in, record their meals with detailed information, such as name, description, date, time, and whether the meal is within or outside the diet. In addition, users can edit or delete their meals, view all recorded meals or just a specific one, and obtain metrics to monitor their diet.

<h2 id="installation">⚙️ Installation</h2>

- 1: Clone this repository: `git clone https://github.com/victorozoterio/daily-diet-api.git`;
- 2: Create a `.env` file from the `.env.example` file;
- 3: Fill in all the necessary variables in the `.env`;
- 4: Install the dependencies, running the command: `npm install`;
- 5: Run the application, running the command: `npm run start:dev`

<h2 id="endpoints">📍 API Endpoints</h2>

| route               | description                                          
|----------------------|-----------------------------------------------------
| <kbd>[POST /users](#post-users)</kbd>     | creates a new user in the system
| <kbd>[POST /users/login](#post-users-login)</kbd>     | login with an existing user
| <kbd>[POST /meals](#post-meals)</kbd>     | creates a new meal in the system
| <kbd>[GET /meals](#get-meals)</kbd>     | retrieves information about all meals
| <kbd>[GET /meals/:uuid](#get-meals-uuid)</kbd>     | retrieves information about a specific meal by UUID
| <kbd>[GET /meals/metrics](#get-meals-metrics)</kbd>     | retrieves metrics of meals eaten
| <kbd>[PUT /meals/:uuid](#put-meals-uuid)</kbd>     | updates information of an existing meal
| <kbd>[DELETE /meals/:uuid](#delete-meals-uuid)</kbd>     | deletes a category from the meal

<h3 id="post-users">POST /users</h3>

**REQUEST**
```json
{
	"name": "victor",
	"email": "victor@gmail.com",
	"password": "Senha@123"
}
```

<h3 id="post-users-login">POST /users/login</h3>

**REQUEST**
```json
{
	"email": "victor@gmail.com",
	"password": "Senha@123"
}
```

<h3 id="post-meals">POST /meals</h3>

**REQUEST**
```json
{
	"name": "fruit salad",
	"description": "apple, banana and strawberry",
	"isWithinTheDiet": true,
	"dateAndTime": "2024-09-28 14:00:00"
}
```

<h3 id="get-meals">GET /meals</h3>

**REQUEST**
```json
No Body
```

<h3 id="get-meals-uuid">GET /meals/:uuid</h3>

**REQUEST**
```json
No Body
```

<h3 id="get-meals-metrics">GET /meals/metrics</h3>

**REQUEST**
```json
No Body
```

<h3 id="put-meals-uuid">PUT /meals/:uuid</h3>

**REQUEST**
```json
{
	"name": "fruit salad",
	"description": "apple, banana, strawberry and papaya",
	"isWithinTheDiet": true,
	"dateAndTime": "2024-09-28 13:30:00"
}
```

<h3 id="delete-meals-uuid">DELETE /meals/:uuid</h3>

**REQUEST**
```json
No Body
```

<h2 id="autor">🧑🏻‍💻 Autor</h2>

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/victorozoterio">
        <img src="https://avatars.githubusercontent.com/u/165734095?v=4" width="100px;" alt="Victor Ozoterio Profile Picture"/><br>
        <sub>
          <a href="https://github.com/victorozoterio">
          Victor Ozoterio</a>
        </sub>
      </a>
    </td>
  </tr>
</table>

<h2 id="contribute">🚀 Contribute</h2>

1. Clone this repository: `git clone https://github.com/victorozoterio/daily-diet-api.git`;
2. Create feature/branch: `git checkout -b feature/NAME`

<h2 id="license">📃 License</h2>

This software is available under the following licenses:

- [MIT](https://rem.mit-license.org)