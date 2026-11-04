# ⚽ Sistema de Predicciones del Mundial 2026 - Instancias Virtualizadas

Este proyecto corresponde al laboratorio calificado de la materia **Desarrollo de Soluciones en la Nube**. Consiste en una aplicación web de pronósticos deportivos (quiniela) contenerizada y balanceada en la nube.

---

## 1. 🏗️ Propuesta de Arquitectura del Sistema (AWS Nomenclatura)

La solución fue diseñada siguiendo los patrones de arquitectura recomendados por AWS para aplicaciones virtualizadas con balanceo de carga:

* **Amazon EC2 (Elastic Compute Cloud):** Instancia virtualizada basada en **Ubuntu 22.04 LTS (t3.medium)** que aloja los contenedores del sistema.
* **AWS Virtual Private Cloud (VPC):** Red virtual aislada con una Subred Pública para exponer la aplicación de forma segura.
* **AWS Security Groups (Firewall):** Reglas de entrada para permitir tráficos en los puertos:
  * `80 / 8080 (HTTP):` Entrada al Reverse Proxy / Balanceador de Carga Nginx.
  * `3000 (TCP):` Comunicación interna con la API Node.js Express.
  * `3306 (TCP):` Persistencia con MySQL Database.
* **Amazon Elastic Container Registry (ECR) / Docker Registry:** Repositorio para la gestión y empaquetado de las imágenes del proyecto.
* **Nginx Load Balancer:** Balanceador de carga actuando dentro del entorno virtualizado para distribuir las peticiones web entre réplicas del Backend.

---

## 2. 💻 Componentes Desarrollados

1. **Backend (Node.js & Express):**
   * API REST funcional para procesar partidos, registro de predicciones y gestión de salas.
   * Implementación matemática estricta de las 5 reglas de puntuación.
2. **Frontend (HTML5 / CSS3 / JavaScript):**
   * Interfaz web responsiva con Modo Oscuro (*Dark Mode*) estilizada como casa de apuestas.
   * Sistema visual para registrar quinielas, visualizar el Leaderboard y unirse a salas con código de invitación.
3. **Base de Datos (MySQL 8.0):**
   * Schema relacional optimizado (`usuarios`, `salas`, `partidos`, `predicciones`, `sala_miembros`).

---

## 3. 🎯 Sistema de Puntuación (5 Reglas de la Guía)

El backend calcula de forma automatizada los puntajes según los criterios del laboratorio:
1. **Resultado exacto (+5 pts):** Acierto al marcador exacto del partido.
2. **Ganador / Empate correcto (+3 pts):** Acierto del ganador o tablas sin marcador exacto.
3. **Diferencia de goles correcta (+2 pts):** Acierto en la brecha de goles entre ambos equipos.
4. **Bonus por racha (+2 pts extra):** Asignado por cada 3 aciertos consecutivos acumulados.
5. **Predicción anticipada (+1 pt extra):** Aplicado si el pronóstico se registra con más de 24 horas de antelación al encuentro.

---

## 4. 🐳 Contenerización y Escalamiento Horizontal

El sistema utiliza **Docker & Docker Compose** para orquestar la infraestructura:

* `docker-compose.yml`: Orquestador multi-contenedor (MySQL, Backend Node.js, Frontend Nginx, Load Balancer).
* **Comando para Escalamiento Horizontal:** Para duplicar o triplicar instancias del backend detrás del balanceador de carga Nginx, se utiliza:
  ```bash
  docker-compose up -d --scale backend=3

## 5. 🧪 Documentación de Pruebas de Estrés (Stress Testing)
Herramienta de Prueba: K6 Testing Framework (stress-test.js).

*Configuración del Escenario:

*Usuarios Virtuales (VUs): 50 usuarios concurrentes simulados.

*Duración: 30 segundos continuos.

*Endpoint bajo prueba: GET /api/health mediante Nginx Load Balancer (Puerto 8080).

*Resultados Obtenidos:

*Éxito HTTP 200: 100% de las peticiones procesadas satisfactoriamente.

*Latencia Promedio: < 15ms.

*Tasa de Errores: 0.00% gracias a la distribución del tráfico realizada por Nginx entre las instancias Node.js.

*👥 Integrantes / Autor
Estudiante: Naomi Sánchez (con la supervisión de Jaime Farfán)

*Curso: Desarrollo de Soluciones en la Nube