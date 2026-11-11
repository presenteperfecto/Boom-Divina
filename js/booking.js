'use strict';

/**
 * public/js/booking.js
 * Flujo interactivo de reserva online en 5 pasos (Wizard)
 */
document.addEventListener('DOMContentLoaded', () => {
  // Estado local del wizard
  const state = {
    currentStep: 1,
    service: null,
    professional: null,
    fecha: null,
    hora_inicio: null,
    client: {
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      notas: ''
    }
  };

  // Elementos de la interfaz
  const stepperItems = document.querySelectorAll('.step-item');
  const wizardSteps = document.querySelectorAll('.wizard-step');

  const btnNext1 = document.getElementById('btnNext1');
  const btnPrev2 = document.getElementById('btnPrev2');
  const btnNext2 = document.getElementById('btnNext2');
  const btnPrev3 = document.getElementById('btnPrev3');
  const btnNext3 = document.getElementById('btnNext3');
  const btnPrev4 = document.getElementById('btnPrev4');
  const btnNext4 = document.getElementById('btnNext4');
  const btnPrev5 = document.getElementById('btnPrev5');
  const btnConfirmBooking = document.getElementById('btnConfirmBooking');
  const acceptTerms = document.getElementById('acceptTerms');

  const serviceSelectorGrid = document.getElementById('serviceSelectorGrid');
  const professionalSelectorGrid = document.getElementById('professionalSelectorGrid');
  const bookingDateInput = document.getElementById('bookingDate');
  const slotsContainer = document.getElementById('slotsContainer');

  // Cambiar de paso
  const goToStep = (stepNumber) => {
    state.currentStep = stepNumber;

    // Actualizar stepper
    stepperItems.forEach(item => {
      const step = parseInt(item.dataset.step, 10);
      if (step === stepNumber) {
        item.classList.add('active');
        item.classList.remove('completed');
      } else if (step < stepNumber) {
        item.classList.remove('active');
        item.classList.add('completed');
      } else {
        item.classList.remove('active', 'completed');
      }
    });

    // Actualizar vistas
    wizardSteps.forEach(step => {
      step.classList.remove('active');
    });
    const currentStepEl = document.getElementById(`step${stepNumber}`);
    if (currentStepEl) currentStepEl.classList.add('active');

    // Scroll suave hacia arriba del card
    document.querySelector('.booking-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Acciones especiales por paso
    if (stepNumber === 2) {
      loadProfessionalsForService();
    } else if (stepNumber === 5) {
      updateSummary();
    }
  };

  // ── PASO 1: Cargar Servicios ──────────────────────────────────────────────
  const loadServices = async () => {
    try {
      const res = await fetch('/api/services');
      const data = await res.json();

      if (!data.success || !data.data || data.data.length === 0) {
        serviceSelectorGrid.innerHTML = '<p class="text-muted">No hay servicios disponibles en este momento.</p>';
        return;
      }

      serviceSelectorGrid.innerHTML = '';
      data.data.forEach(srv => {
        const card = document.createElement('div');
        card.className = 'service-select-card';
        card.dataset.id = srv.id;
        card.innerHTML = `
          <div class="service-select-header">
            <h4>${srv.nombre}</h4>
            <span class="price-badge">$${Number(srv.precio).toLocaleString('es-AR')}</span>
          </div>
          <p class="service-select-desc">${srv.descripcion || ''}</p>
          <div class="service-select-footer">
            <span><i data-feather="clock" class="icon-small"></i> ${srv.duracion_min} min</span>
            ${srv.requires_sena ? `<span class="sena-badge"><i data-feather="check-square" class="icon-small"></i> Seña: $${Number(srv.precio_sena).toLocaleString('es-AR')}</span>` : ''}
          </div>
        `;

        card.addEventListener('click', () => {
          document.querySelectorAll('.service-select-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          state.service = srv;
          btnNext1.disabled = false;
        });

        serviceSelectorGrid.appendChild(card);

        // Preselección automática si viene de la URL
        if (window.PRESELECTED_SERVICE_ID && String(srv.id) === String(window.PRESELECTED_SERVICE_ID)) {
          card.click();
        }
      });

      if (window.feather) feather.replace();
    } catch {
      serviceSelectorGrid.innerHTML = '<p class="text-danger">Error al cargar servicios.</p>';
    }
  };

  // ── PASO 2: Cargar Profesionales ──────────────────────────────────────────
  const loadProfessionalsForService = async () => {
    if (!state.service) return;

    professionalSelectorGrid.innerHTML = '<div class="loading-spinner">Cargando especialistas...</div>';
    btnNext2.disabled = true;

    try {
      const res = await fetch(`/api/professionals?service_id=${state.service.id}`);
      const data = await res.json();

      professionalSelectorGrid.innerHTML = '';

      // Opción: "Cualquier profesional disponible"
      const anyCard = document.createElement('div');
      anyCard.className = 'prof-select-card';
      anyCard.dataset.id = 'any';
      anyCard.innerHTML = `
        <div class="prof-avatar-placeholder"><i data-feather="users"></i></div>
        <div class="prof-info">
          <h4>Cualquier especialista</h4>
          <p class="text-muted">Asigna automáticamente la primera profesional disponible en tu horario.</p>
        </div>
      `;
      anyCard.addEventListener('click', () => {
        document.querySelectorAll('.prof-select-card').forEach(c => c.classList.remove('selected'));
        anyCard.classList.add('selected');
        // Si elige cualquiera, tomamos la primera disponible o dejamos que el backend resuelva
        state.professional = data.data && data.data.length > 0 ? data.data[0] : { id: 1, nombre: 'Cualquier', apellido: 'Especialista' };
        btnNext2.disabled = false;
      });
      professionalSelectorGrid.appendChild(anyCard);

      if (data.success && data.data && data.data.length > 0) {
        data.data.forEach(prof => {
          const card = document.createElement('div');
          card.className = 'prof-select-card';
          card.dataset.id = prof.id;
          card.innerHTML = `
            <div class="prof-avatar-placeholder"><i data-feather="user"></i></div>
            <div class="prof-info">
              <h4>${prof.nombre} ${prof.apellido}</h4>
              <p class="text-muted">${prof.especialidades || 'Especialista en Estética'}</p>
            </div>
          `;

          card.addEventListener('click', () => {
            document.querySelectorAll('.prof-select-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            state.professional = prof;
            btnNext2.disabled = false;
          });

          professionalSelectorGrid.appendChild(card);
        });
      }

      if (window.feather) feather.replace();
    } catch {
      professionalSelectorGrid.innerHTML = '<p class="text-danger">Error al cargar profesionales.</p>';
    }
  };

  // ── PASO 3: Cargar Horarios Disponibles (Slots) ───────────────────────────
  const loadSlots = async () => {
    const fecha = bookingDateInput.value;
    if (!fecha || !state.service || !state.professional) return;

    state.fecha = fecha;
    state.hora_inicio = null;
    btnNext3.disabled = true;
    slotsContainer.innerHTML = '<div class="loading-spinner" style="grid-column: 1 / -1; padding: 20px;">Consultando disponibilidad...</div>';

    try {
      const res = await fetch(`/api/availability?professional_id=${state.professional.id}&service_id=${state.service.id}&fecha=${fecha}`);
      const data = await res.json();

      slotsContainer.innerHTML = '';

      if (!data.success || !data.slots || data.slots.length === 0) {
        slotsContainer.innerHTML = '<p class="text-muted text-center" style="grid-column: 1 / -1; padding: 20px;">No hay turnos disponibles para esta fecha. Probá seleccionando otro día.</p>';
        return;
      }

      const availableSlots = data.slots.filter(s => s.disponible);
      if (availableSlots.length === 0) {
        slotsContainer.innerHTML = '<p class="text-muted text-center" style="grid-column: 1 / -1; padding: 20px;">Todos los turnos de esta fecha ya están ocupados. Por favor seleccioná otro día.</p>';
        return;
      }

      availableSlots.forEach(slot => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'slot-chip';
        chip.textContent = `${slot.hora_inicio} hs`;

        chip.addEventListener('click', () => {
          document.querySelectorAll('.slot-chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
          state.hora_inicio = slot.hora_inicio;
          btnNext3.disabled = false;
        });

        slotsContainer.appendChild(chip);
      });
    } catch {
      slotsContainer.innerHTML = '<p class="text-danger text-center" style="grid-column: 1 / -1;">Error al consultar horarios.</p>';
    }
  };

  bookingDateInput?.addEventListener('change', loadSlots);

  // ── PASO 4: Validar Datos de Contacto ─────────────────────────────────────
  const validateClientForm = () => {
    const nombre = document.getElementById('clientNombre').value.trim();
    const telefono = document.getElementById('clientTelefono').value.trim();

    if (!nombre) {
      alert('Por favor ingresá tu nombre');
      document.getElementById('clientNombre').focus();
      return false;
    }
    if (!telefono || telefono.length < 8) {
      alert('Por favor ingresá un número de teléfono o WhatsApp válido');
      document.getElementById('clientTelefono').focus();
      return false;
    }

    state.client.nombre = nombre;
    state.client.apellido = document.getElementById('clientApellido').value.trim();
    state.client.telefono = telefono;
    state.client.email = document.getElementById('clientEmail').value.trim();
    state.client.notas = document.getElementById('clientNotas').value.trim();

    return true;
  };

  // ── PASO 5: Actualizar Resumen y Enviar ────────────────────────────────────
  const updateSummary = () => {
    if (!state.service || !state.professional) return;

    document.getElementById('sumService').textContent = state.service.nombre;
    document.getElementById('sumProfessional').textContent = `${state.professional.nombre} ${state.professional.apellido}`;
    document.getElementById('sumDateTime').textContent = `${state.fecha} a las ${state.hora_inicio} hs`;
    document.getElementById('sumClient').textContent = `${state.client.nombre} ${state.client.apellido} (${state.client.telefono})`;
    document.getElementById('sumPrice').textContent = `$${Number(state.service.precio).toLocaleString('es-AR')}`;

    const depositMonto = state.service.requires_sena ? Number(state.service.precio_sena) : 0;
    document.getElementById('sumDeposit').textContent = depositMonto > 0 ? `$${depositMonto.toLocaleString('es-AR')}` : 'Sin seña';
  };

  acceptTerms?.addEventListener('change', (e) => {
    btnConfirmBooking.disabled = !e.target.checked;
  });

  // Enviar Reserva al Backend
  btnConfirmBooking?.addEventListener('click', async () => {
    btnConfirmBooking.disabled = true;
    btnConfirmBooking.innerHTML = '<span>Procesando solicitud...</span>';

    const payload = {
      client_data: state.client,
      professional_id: state.professional.id,
      service_id: state.service.id,
      fecha: state.fecha,
      hora_inicio: state.hora_inicio,
      notas: state.client.notas
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.data && data.data.redirect_url) {
        window.location.href = data.data.redirect_url;
      } else {
        alert(data.message || 'Error al procesar la reserva');
        btnConfirmBooking.disabled = false;
        btnConfirmBooking.innerHTML = '<span>Confirmar Solicitud de Turno</span>';
      }
    } catch {
      alert('Error de conexión con el servidor. Intente nuevamente.');
      btnConfirmBooking.disabled = false;
      btnConfirmBooking.innerHTML = '<span>Confirmar Solicitud de Turno</span>';
    }
  });

  // Event Listeners de Botones Next/Prev
  btnNext1?.addEventListener('click', () => goToStep(2));
  btnPrev2?.addEventListener('click', () => goToStep(1));
  btnNext2?.addEventListener('click', () => goToStep(3));
  btnPrev3?.addEventListener('click', () => goToStep(2));
  btnNext3?.addEventListener('click', () => goToStep(4));
  btnPrev4?.addEventListener('click', () => {
    if (validateClientForm()) goToStep(5);
  });
  btnNext4?.addEventListener('click', () => {
    if (validateClientForm()) goToStep(5);
  });
  btnPrev5?.addEventListener('click', () => goToStep(4));

  // Inicializar cargando servicios
  loadServices();
});
