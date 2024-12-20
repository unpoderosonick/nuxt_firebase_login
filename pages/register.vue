<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-50">
    <h1 class="text-2xl font-bold mb-4">Registro</h1>
    <form @submit.prevent="registerUser" class="flex flex-col gap-4 w-1/3">
      <!-- Input de nombre -->
      <input
        v-model="name"
        type="text"
        placeholder="Nombre"
        class="p-2 border border-gray-300 rounded"
      />

      <!-- Input de correo -->
      <input
        v-model="email"
        type="email"
        placeholder="Correo"
        class="p-2 border border-gray-300 rounded"
      />

      <!-- Input de contraseña -->
      <input
        v-model="password"
        type="password"
        placeholder="Contraseña"
        class="p-2 border border-gray-300 rounded"
      />

      <!-- Selección de idioma -->
      <select
        v-model="language"
        class="p-2 border border-gray-300 rounded"
      >
        <option value="es">Español</option>
        <option value="en">Inglés</option>
        <option value="fr">Francés</option>
      </select>

      <!-- Selección de zona horaria -->
      <select
        v-model="timezone"
        class="p-2 border border-gray-300 rounded"
      >
        <option value="America/Lima">Lima (GMT-5)</option>
        <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
        <option value="Europe/Madrid">Madrid (GMT+1)</option>
      </select>

      <!-- Botón de registro -->
      <button type="submit" class="bg-blue-500 text-white py-2 rounded">
        Registrarse
      </button>
    </form>

    <!-- Mensajes de error -->
    <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>

    <!-- Enlace para regresar al login -->
    <NuxtLink to="/login" class="text-blue-500 underline mt-4">
      ¿Ya tienes cuenta? Inicia sesión
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useNuxtApp } from '#app';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const name = ref('');
const email = ref('');
const password = ref('');
const language = ref('es');
const timezone = ref('America/Lima');
const errorMessage = ref('');
const router = useRouter();

const registerUser = async () => {
  try {
    const { $axios, $firebaseAuth } = useNuxtApp();

    // Validación básica
    if (!name.value || !email.value || !password.value) {
      errorMessage.value = 'Por favor, completa todos los campos.';
      return;
    }

    // Crear usuario en Firebase
    const userCredential = await createUserWithEmailAndPassword(
      $firebaseAuth,
      email.value,
      password.value
    );

    // Obtener el token del usuario
    const idToken = await userCredential.user.getIdToken();

    // Enviar información adicional al backend
    await $axios.post('/auth/register/', {
      token: idToken,
      name: name.value,
      language: language.value,
      timezone: timezone.value,
    });

    // Redirigir al login después del registro
    router.push('/login');
  } catch (error) {
    console.error('Error en el registro:', error);
    if (error.code === 'auth/email-already-in-use') {
      errorMessage.value = 'El correo ya está registrado.';
    } else {
      errorMessage.value = 'Error al registrarse.';
    }
  }
};
</script>
