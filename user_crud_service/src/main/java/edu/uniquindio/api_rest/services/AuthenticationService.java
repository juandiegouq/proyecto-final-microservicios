package edu.uniquindio.api_rest.services;

import edu.uniquindio.api_rest.models.Error;
import edu.uniquindio.api_rest.models.Login;
import edu.uniquindio.api_rest.models.RecuperacionClave;
import edu.uniquindio.api_rest.models.Token;
import edu.uniquindio.api_rest.models.Usuario;
import edu.uniquindio.api_rest.repositories.UserRepository;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.security.core.Authentication;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthenticationService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            JavaMailSender mailSender,
            JwtService jwtService,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<?> authenticate(Login input) {
        try {
            // Validar si el formato del JSON es correcto
            if (input.getNombreUsuario() == null || input.getContraseña() == null) {
                // Formato incorrecto
                Error error = new Error("Nombre de usuario o contraseña faltantes.");
                return new ResponseEntity<>(error.getMessage(), HttpStatus.BAD_REQUEST);
            }

            // Autenticar el usuario
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(input.getNombreUsuario(), input.getContraseña()));
            // Si la autenticación es exitosa, generar el token JWT
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtService.generateToken((UserDetails) authentication.getPrincipal());
            Token token = new Token(jwt);
            return new ResponseEntity<>(token, HttpStatus.OK);

        } catch (BadCredentialsException e) {
            // Credenciales inválidas
            Error error = new Error("Credenciales no válidas.");
            return new ResponseEntity<>(error.getMessage(), HttpStatus.UNAUTHORIZED);
        }
    }

    // Recuperar contraseña
    public ResponseEntity<?> recuperarContraseña(RecuperacionClave recuperacionClave) {
        // Formato no válido, 400
        if (recuperacionClave.getCorreo() == null) {
            Error error = new Error("Correo electrónico no proporcionado.");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }

        // Correo no encontrado, 404
        Optional<Usuario> usuarioOptional = userRepository.findByCorreo(recuperacionClave.getCorreo());
        if (usuarioOptional.isEmpty()) {
            Error error = new Error("No se encontró el usuario.");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }

        Usuario usuario = usuarioOptional.get();

        // Crear el JSON para enviar al servicio de notificaciones
        Map<String, Object> notificationRequest = new HashMap<>();
        notificationRequest.put("recipients", Collections.singletonList(recuperacionClave.getCorreo()));
        notificationRequest.put("channels", Collections.singletonList("Email"));

        Map<String, String> messageContent = new HashMap<>();
        messageContent.put("subject", "Recuperación de Contraseña");
        messageContent.put("body", "Su contraseña es: " + passwordEncoder.encode(usuario.getContraseña()));
        notificationRequest.put("message", messageContent);

        // Configurar headers para enviar como JSON
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Crear la entidad HTTP con el body y headers
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(notificationRequest, headers);

        // Enviar la solicitud al microservicio de notificaciones
        RestTemplate restTemplate = new RestTemplate();
        String notificationServiceUrl = "http://notification-service:3001/notifications";

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    notificationServiceUrl,
                    HttpMethod.POST,
                    request,
                    String.class);

            // Verificar si la solicitud fue exitosa
            if (response.getStatusCode() == HttpStatus.OK) {
                return new ResponseEntity<>("Correo de recuperación enviado con éxito.", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Error al enviar el correo de recuperación.",
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error al conectar con el servicio de notificaciones.",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
