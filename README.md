# Pedidos360 - Frontend Angular

Frontend del proyecto Pedidos360, desarrollado para Desarrollo Cloud Native I.

## Tecnologias

- Angular 22 y TypeScript.
- AWS Cognito para autenticacion de administradores y clientes.
- Microsoft Entra ID / MSAL para el flujo de operador.
- API Gateway y AWS Lambda para consultar Reportes.
- Grafana para visualizacion de indicadores.

## Funcionalidades verificadas

- Inicio de sesion de Administrador mediante Cognito.
- Inicio de sesion de Cliente mediante Cognito.
- Proteccion de la ruta /reportes para ROLE_ADMIN.
- Consulta de KPI de Reportes mediante API Gateway.
- Visualizacion de pedidos, ventas y tiempos de entrega.
- Dashboard Grafana embebido mediante iframe.
- Restriccion de acceso a KPI en AWS para ROLE_CLIENTE.

## Arquitectura de Reportes

Angular
  -> API Gateway (autenticacion JWT)
  -> AWS Lambda (autorizacion ROLE_ADMIN)
  -> Microservicio Reportes en EC2
  -> PostgreSQL RDS

El microservicio Reportes consume eventos publicados mediante Kafka.

El dashboard embebido utiliza Grafana y Prometheus.

## Requisitos locales

- Node.js y npm compatibles con Angular 22.
- Backend Users disponible en localhost:8084.
- PostgreSQL configurado para Users.
- Credenciales AWS validas en el entorno del backend Users.
- Conexion a AWS para consultar Reportes.

## Ejecucion

Instalar dependencias:

    npm ci

Iniciar Angular:

    npm start

Abrir en el navegador:

    http://localhost:4200

Comprobar compilacion:

    npm run build

## Rutas principales

- /login: inicio de sesion.
- /reportes: indicadores administrativos.
- /operador: funcionalidad de operador protegida mediante MSAL.
- /pedidos: ruta protegida mediante MSAL.

## Configuracion

Los archivos de entorno Angular incluyen las rutas del backend Users.

Durante las pruebas, Users se ejecuta en:

    http://localhost:8084

Reportes se consulta mediante API Gateway en AWS.

No almacenar contrasenas, tokens JWT ni credenciales AWS en GitHub.

## Grafana

El iframe de Reportes utiliza localhost:3000.

Para la demostracion local, Grafana requiere un tunel SSH activo
hacia la instancia EC2 donde se encuentra desplegado.

El acceso compartido o permanente a Grafana no esta implementado.

## Seguridad

- ROLE_ADMIN puede consultar indicadores administrativos.
- ROLE_CLIENTE no puede acceder a Reportes.
- La API de AWS tambien aplica autenticacion y autorizacion.
- Las verificaciones del frontend no sustituyen los controles del backend.

## Pendientes conocidos

- Conectar el formulario Registrarme con un registro seguro en Cognito.
- Implementar confirmacion real del correo electronico.
- Endurecer el endpoint de registro de Users antes de publicarlo.
- Resolver el acceso compartido a Grafana.
- Completar las pruebas de integracion y evidencias finales.

## Control de versiones

Se utiliza GitHub Flow mediante ramas de funcionalidad y Pull Requests.

La integracion de Reportes y Grafana se desarrolla en:

    feat/grafana-reportes

Los repositorios backend se administran por separado.

## Estado

La reportería administrativa y la separacion de roles fueron
probadas en el entorno de desarrollo.

El registro autonomo de clientes desde Angular sigue pendiente.