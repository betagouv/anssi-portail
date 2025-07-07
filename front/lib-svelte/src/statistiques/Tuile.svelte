<script lang="ts">
  export let image: string;
  export let mesure: number;
  export let description: string;
</script>

<div class="tuile">
  <img src={`/assets/images/${image}.svg`} alt={description} />
  <span class="mesure">{mesure}</span>
  <span class="description">{description}</span>
</div>

<style lang="scss">
  .tuile {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 32px 32px;

    border: 1px #ddd solid;
    border-radius: 8px;

    img {
      margin-bottom: 16px;
    }

    .mesure {
      font-size: 1.75rem;
      line-height: 2.25rem;
      font-weight: bold;
      color: #161616;
      margin-bottom: 8px;
    }
    .description {
      font-size: 1.125rem;
      line-height: 1.75rem;
      color: #3a3a3a;
      text-align: center;
    }
  }
</style>
