<script lang="ts"></script>

<div class="carte">
  <div class="tags">
    {#each ['1', '2'] as id (id)}
      <div class="skeleton tag" {id}></div>
    {/each}
  </div>

  <div class="content">
    <div class="skeleton line largeur-80"></div>
    <div class="skeleton line largeur-40"></div>
    <div class="skeleton line largeur-60"></div>
  </div>

  <div class="tags">
    {#each ['1', '2'] as id (id)}
      <div class="skeleton tag" {id}></div>
    {/each}
  </div>

  <div class="contents">
    <div class="skeleton line"></div>
  </div>
</div>

<style>
  .carte {
    box-sizing: border-box;
    border: 1px solid var(--border-default-grey);
    border-radius: 8px;
    padding: 1rem;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    height: 406px;
    width: 286px;
  }

  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .tag {
    width: 60px;
    height: 20px;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin: 131px 0 1rem;
  }

  .line {
    height: 16px;
  }

  .largeur-80 {
    width: 80%;
  }

  .largeur-40 {
    width: 40%;
  }

  .largeur-60 {
    width: 60%;
  }
</style>
