'use strict';

/**
 * public/js/admin.js
 * Funcionalidades del Panel Administrativo de BOOM DIVINA
 */
document.addEventListener('DOMContentLoaded', () => {
  // Toggle del Sidebar en mobile
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('adminSidebar');

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('active');
    });
  }

  // Marcar enlace activo en el sidebar
  const currentPath = window.location.pathname;
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // Botones de acción rápida de estado
  document.querySelectorAll('.quick-status-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const aptId = btn.dataset.id;
      const estado = btn.dataset.status;

      if (!confirm(`¿Desea cambiar el estado a ${estado}?`)) return;

      try {
        const res = await fetch(`/admin/appointments/${aptId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado })
        });
        const data = await res.json();
        if (data.success) {
          location.reload();
        } else {
          alert(data.message);
        }
      } catch {
        alert('Error al actualizar estado');
      }
    });
  });
});
