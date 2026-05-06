<div align="center">
  <h1>🎯 FPS Three.js Engine</h1>
  <p>
    <strong>Un motor de FPS (First-Person Shooter) ligero y modular construido con Three.js y TypeScript.</strong>
  </p>

  <!-- Badges -->
  <img src="https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Vitest-6E9F18?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
</div>

<br />

## 📖 Descripción

Este proyecto es una plantilla/motor escalable para crear juegos 3D en el navegador web. Implementa un sistema de físicas básicas, disparo por *Raycasting*, <i>bobbing</i> de cámara, retroceso de armas, hitmarkers 2D dinámicos e instanciación de enemigos mediante programación orientada a objetos pura.

Lo que hace destacar a este motor es su **arquitectura estricta de separación de responsabilidades (Clean Architecture / MVC)**. En lugar de mezclar gráficos (Three.js) con lógica matemática, el código está radicalmente dividido.

---

## ✨ Características Principales

*   **Controles FPS fluidos:** Movimiento en todas las direcciones con salto, gravedad y sistema de "sprint" acelerado.
*   **Bobbing de cámara realista:** Balanceo del arma al caminar/correr.
*   **Armas y Disparo:** Raycasting eficiente, retroceso interpolado de armas y marcadores de daño visual (*Floating Damage Numbers*).
*   **Event Bus Integrado:** Comunicación de eventos completamente desacoplada (`PLAYER_SHOOT`, `ENEMY_HIT`, `ENEMY_DEATH`).
*   **Arquitectura MVC estricta:** Modelos puramente matemáticos y vistas de WebGL/Three.js 100% aisladas.
*   **Test Driven (TDD):** Soporte total con Vitest para unidades aisladas, sin depender del DOM ni canvas reales gracias a su arquitectura limpia.

---

## 🏗️ Arquitectura y Estructura

El motor está diseñado bajo el principio de responsabilidad única (*Single Responsibility Principle*) para facilitar la escalabilidad.

```text
src/
├── core/         # Infraestructura base del motor (Engine de bucle principal, Input, Eventos)
├── entities/     # Entidades complejas no separadas aún (Player - Mezcla de cámara e input)
├── managers/     # Controladores que coordinan modelos y vistas (EnemyManager, ProjectileManager)
├── models/       # Estado numérico y lógica matemática PURA. Cero referencias visuales.
├── views/        # Mallas (Meshes), Renderers, Escena, Luces y DOM (Totalmente acoplado a Three.js)
└── shared/       # Interfaces y tipos cruzados (IHittable, IEnemy)
```

---

## 🚀 Instalación y Uso

Asegúrate de tener [Node.js](https://nodejs.org/) y [pnpm](https://pnpm.io/) instalados.

**1. Clonar el repositorio**
```bash
git clone https://github.com/Roberguezz/fps-threejs.git
cd fps-threejs
```

**2. Instalar dependencias**
```bash
pnpm install
```

**3. Iniciar entorno de desarrollo**
```bash
pnpm run dev
```

---

## 🛠️ Comandos Útiles

El proyecto utiliza un linter avanzado con formato automático nativo (sin depender de Prettier).

| Comando | Descripción |
|---|---|
| `pnpm run dev` | Inicia el servidor de desarrollo ultrarrápido con Vite. |
| `pnpm run build` | Compila TypeScript y empaqueta la versión lista para producción. |
| `pnpm run test` | Ejecuta la batería completa de tests unitarios (Vitest). |
| `pnpm run lint` | Comprueba problemas de estilo e indentación (ESLint). |
| `pnpm run lint:fix`| Repara automáticamente el formato (Comillas simples, Tabs, sin `;`). |

---

## 🎮 Controles de Juego

- **W, A, S, D:** Moverse
- **Espacio:** Saltar
- **Shift:** Correr
- **Click Izquierdo:** Disparar (Bloquea el puntero en la pantalla al primer clic)

<br/>
<div align="center">
  <i>Desarrollado con pasión usando Three.js</i>
</div>
