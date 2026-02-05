<script lang="ts"></script>

<li class="skeleton-item">
  <div class="skeleton-label">
    <span class="skeleton-checkbox"></span>
    <span class="skeleton-libelle"></span>
  </div>
</li>

<style>
  .skeleton-item {
    list-style: none;
    padding: 0.5rem 0;
  }

  .skeleton-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .skeleton-checkbox {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background-color: var(--background-default-grey);
    animation: pulse 1.5s infinite;
  }

  .skeleton-libelle {
    flex: 1;
    height: 1rem;
    background-color: var(--background-default-grey);
    border-radius: 4px;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
</style>
