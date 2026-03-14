# 🏛️ Estructura

# 📦 Servicios
- Orders | Servicio para controlar las ordenes
    - /orders
        - GET
        - POST

# ♾️ Limitantes
* Te limite maximo de 100 ordenes por llamada, esto mantiene un equilibrio en performars

# 💻 Usar en local

1. Ingresar al servicio a usar (orders)
```
cd ./src/services/{service_name}  
```

2. Levantar las funciones
```
npm run start  
```

# 🚀 Desplegar

1. Debemos estar en la raiz del proyecto
2. Configurar nuestras credenciales de AWS
3. Ejecutar el siguiente comando
```
npm run deploy
```

# 👷 Arquitectura General
