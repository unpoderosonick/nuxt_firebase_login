<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-50">
    <h1 class="text-2xl font-bold mb-4">Iniciar Sesión</h1>
    <form @submit.prevent="login" class="flex flex-col gap-4 w-1/3">
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

      <!-- Botón de inicio de sesión -->
      <button type="submit" class="bg-green-500 text-white py-2 rounded">
        Iniciar Sesión
      </button>
    </form>

    <!-- Mensajes de error -->
    <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>

    <!-- Enlace para recuperar contraseña -->
    <NuxtLink to="/reset-password" class="text-blue-500 underline mt-4">
      ¿Olvidaste tu contraseña?
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useNuxtApp } from '#app';
import { signInWithEmailAndPassword } from 'firebase/auth';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const login = async () => {
  try {
    const { $axios, $firebaseAuth } = useNuxtApp(); // Usar Axios y Firebase desde los plugins

    // Validar que los campos no estén vacíos
    if (!email.value || !password.value) {
      errorMessage.value = 'Por favor, completa todos los campos.';
      return;
    }

    // Autenticar con Firebase
    const userCredential = await signInWithEmailAndPassword(
      $firebaseAuth,
      email.value,
      password.value
    );

    // Obtener el token de Firebase
    const idToken = await userCredential.user.getIdToken();

    // Enviar el token al backend para validación
    const response = await $axios.post('/auth/validate-token/', {
      token: idToken,
    });

    // Si el token es válido, guardar el acceso
    if (response.status === 200) {
      useCookie('authToken').value = idToken; // Guardar el token en una cookie
      router.push('/home'); // Redirigir al home
    } else {
      errorMessage.value = 'Error al validar el token.';
    }
  } catch (error) {
    if (error.response) {
      // Error en la respuesta del servidor
      console.error('Error del backend:', error.response.data);
      errorMessage.value = error.response.data.error || 'Error en el servidor.';
    } else if (error.request) {
      // Error en la solicitud
      console.error('Error en la solicitud:', error.request);
      errorMessage.value = 'No se pudo conectar al servidor. Verifica tu conexión.';
    } else {
      // Otro tipo de error
      console.error('Error inesperado:', error.message);
      errorMessage.value = 'Ocurrió un error inesperado.';
    }
  }
};
</script>
