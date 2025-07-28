<script lang="ts">
</script>

<details>
  <summary>
    <slot name="titre" />
  </summary>
  <slot name="corps" />
</details>

<style lang="scss">
  details {
    border-bottom: 1px solid #ddd;

    &:first-of-type {
      border-top: 1px solid #ddd;
    }

    &[open] summary::after {
      transform: rotate(-180deg);
    }

    &[open] summary {
      background-color: var(--jaune-clair-msc);
    }
    summary {
      padding: 12px 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      cursor: pointer;

      &::marker {
        content: '';
      }

      &::-webkit-details-marker {
        display: none;
      }

      &:after {
        content: '';
        display: block;
        width: 16px;
        height: 16px;
        background: url('/assets/images/icone-chevron-bas.svg');
        transition: transform 0.3s linear;
        margin-left: auto;
      }
    }
  }
</style>
