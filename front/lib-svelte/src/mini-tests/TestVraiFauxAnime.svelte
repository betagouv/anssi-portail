<script lang="ts">
  const { survol = $bindable() }: { survol?: boolean } = $props();
</script>

<div>
  <svg
    class="picto-quiz"
    viewBox="0 0 192 128"
    width="192"
    height="128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class:survol
  >
    <g class="piece p-false">
      <g transform="translate(34,37)">
        <g id="false">
          <rect
            x="1"
            y="1"
            width="48"
            height="58"
            rx="6"
            fill="#E3E3FD"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17 20.7727L33 36.5909"
            stroke="#000091"
            stroke-width="4"
            stroke-miterlimit="10"
            stroke-linecap="round"
          />
          <path
            d="M33 20.7727L17 36.5909"
            stroke="#000091"
            stroke-width="4"
            stroke-miterlimit="10"
            stroke-linecap="round"
          />
        </g>
      </g>
    </g>

    <g class="piece p-true">
      <g transform="translate(108,37)">
        <g id="True">
          <rect
            x="1"
            y="1"
            width="48"
            height="58"
            rx="6"
            fill="#8585F6"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M16.0001 29.7142L22.788 37.3332L34.6668 23.9999"
            stroke="#000091"
            stroke-width="4"
            stroke-miterlimit="10"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
      </g>
    </g>

    <g class="piece p-card">
      <g transform="translate(58,20)">
        <g id="card">
          <rect
            x="1"
            y="1"
            width="74"
            height="92"
            rx="6"
            fill="white"
            stroke="#000091"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M17.3334 33H59.3334"
            stroke="#000091"
            stroke-width="6"
            stroke-miterlimit="10"
            stroke-linecap="round"
          />
          <path
            d="M17 46.6667L59 46.6666"
            stroke="#000091"
            stroke-width="6"
            stroke-miterlimit="10"
            stroke-linecap="round"
          />
          <path
            d="M17.3334 61H41.3334"
            stroke="#000091"
            stroke-width="6"
            stroke-miterlimit="10"
            stroke-linecap="round"
          />
        </g>
      </g>
    </g>

    <g class="piece p-deco">
      <g transform="translate(124,14)">
        <path
          id="deco"
          d="M1 1H3.8C9.98559 1 15 6.01441 15 12.2V15"
          stroke="#6A6AF4"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </g>
  </svg>
</div>

<style lang="scss">
  .picto-quiz {
    .piece {
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .p-false {
      transform-origin: 59px 67px;
    }

    .p-true {
      transform-origin: 133px 67px;
    }

    .p-card {
      transform-origin: 96px 67px;
    }

    .p-deco {
      transform-origin: 132px 22px;
    }

    &:hover,
    &.survol {
      .p-false {
        transform: translate(-21.962px, 0px) rotate(-6deg) scale(1.1208, 1.081);
      }

      .p-true {
        transform: translate(21.962px, 0px) rotate(6deg) scale(1.1208, 1.081);
      }

      .p-card {
        transform: translate(-0.151px, -0.333px) scale(1.1532, 1.1304);
      }

      .p-deco {
        transform: translate(5.516px, -6.333px);
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .cartes * {
      transition: none !important;
    }
  }
</style>
