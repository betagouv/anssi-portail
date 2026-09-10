<script lang="ts"></script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width="486"
  height="368"
  viewBox="0 0 486 368"
  role="img"
  aria-labelledby="radar-title radar-description"
>
  <title id="radar-title">Radar animé vectoriel avec profils de risques variables</title>
  <desc id="radar-description">
    Diagramme radar présentant cinq familles de risques cyber. Après son tracé, la courbe évolue en continu entre trois
    profils irréguliers et ses points suivent chaque nouvelle position. Le balayage lumineux utilise un dégradé conique
    CSS intégré dans le SVG, sans image matricielle.
  </desc>

  <defs>
    <clipPath id="radar-gradient-clip">
      <circle cx="243" cy="184" r="148" />
    </clipPath>

    <filter id="icon-shadow" x="-40%" y="-30%" width="180%" height="200%" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="6" stdDeviation="9" flood-color="#000012" flood-opacity="0.16" />
    </filter>
  </defs>

  <!-- Même procédé que pictogramme-exposition.svg : dégradé conique CSS intégré. -->
  <g class="radar-gradient" opacity=".4" clip-path="url(#radar-gradient-clip)">
    <foreignObject x="95" y="36" width="296" height="296">
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        style="width:296px;height:296px;background:conic-gradient(from 90deg,rgba(255,255,255,0) 0deg,rgba(106,106,244,1) 360deg)"
      ></div>
    </foreignObject>
  </g>

  <g aria-hidden="true" transform="translate(100.16 34) scale(.99654 .9959)">
    <path
      d="M142.746.618l.521 149L285.746 104.118M143.193 149.618l87.614 122M142.882 149.618.403 104.118M142.957 149.618l-87.614 122"
      fill="none"
      stroke="#929292"
      stroke-dasharray="4 4"
    />
    <path
      d="M143.246 80.618l66.574 48.369-25.429 78.262h-82.29l-25.429-78.262 66.574-48.369Z"
      fill="none"
      stroke="#3a3a3a"
    />
    <path
      d="M143.246 40.618l104.616 76.008-39.959 122.984H78.59L38.63 116.626 143.246 40.618Z"
      fill="none"
      stroke="#3a3a3a"
    />
    <path
      d="M143.246.618l142.659 103.647-54.491 167.706H55.079L.588 104.265 143.246.618Z"
      fill="none"
      stroke="#3a3a3a"
    />
    <path
      d="M143.246 119.618l28.532 20.73-10.898 33.541h-35.267l-10.898-33.541 28.531-20.73Z"
      fill="none"
      stroke="#3a3a3a"
    />
  </g>

  <g aria-hidden="true" transform="translate(170 26)">
    <path class="radar-data-fill" d="M 73 8.6 L 8 136.3 L 8 247 L 89 179.4 L 177 123.9 Z">
      <animate
        attributeName="d"
        begin="2.2s"
        dur="6s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;.1;.33333;.43333;.66666;.76666;1"
        keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1"
        values="M 73 8.6 L 8 136.3 L 8 247 L 89 179.4 L 177 123.9 Z;
          M 73 8.6 L 8 136.3 L 8 247 L 89 179.4 L 177 123.9 Z;
          M 73 34 L 30.2 143.4 L 27 220.8 L 118.8 220.8 L 149.9 132.5 Z;
          M 73 34 L 30.2 143.4 L 27 220.8 L 118.8 220.8 L 149.9 132.5 Z;
          M 73 52 L 17.4 139.3 L 19.9 230.5 L 103.1 198.9 L 168.9 126.4 Z;
          M 73 52 L 17.4 139.3 L 19.9 230.5 L 103.1 198.9 L 168.9 126.4 Z;
          M 73 8.6 L 8 136.3 L 8 247 L 89 179.4 L 177 123.9 Z"
      />
    </path>
    <path class="radar-data-line" pathLength="1" d="M 73 8.6 L 8 136.3 L 8 247 L 89 179.4 L 177 123.9 Z">
      <animate
        attributeName="d"
        begin="2.2s"
        dur="6s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;.1;.33333;.43333;.66666;.76666;1"
        keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1"
        values="M 73 8.6 L 8 136.3 L 8 247 L 89 179.4 L 177 123.9 Z;
          M 73 8.6 L 8 136.3 L 8 247 L 89 179.4 L 177 123.9 Z;
          M 73 34 L 30.2 143.4 L 27 220.8 L 118.8 220.8 L 149.9 132.5 Z;
          M 73 34 L 30.2 143.4 L 27 220.8 L 118.8 220.8 L 149.9 132.5 Z;
          M 73 52 L 17.4 139.3 L 19.9 230.5 L 103.1 198.9 L 168.9 126.4 Z;
          M 73 52 L 17.4 139.3 L 19.9 230.5 L 103.1 198.9 L 168.9 126.4 Z;
          M 73 8.6 L 8 136.3 L 8 247 L 89 179.4 L 177 123.9 Z"
      />
    </path>
    <circle class="radar-point" style="--point-delay: .55s" cx="73" cy="8.6" r="8">
      <animate
        attributeName="cy"
        begin="2.2s"
        dur="6s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;.1;.33333;.43333;.66666;.76666;1"
        keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1"
        values="8.6;8.6;34;34;52;52;8.6"
      />
    </circle>
    <circle class="radar-point" style="--point-delay: .85s" cx="8" cy="136.3" r="8">
      <animate
        attributeName="cx"
        begin="2.2s"
        dur="6s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;.1;.33333;.43333;.66666;.76666;1"
        keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1"
        values="8;8;30.2;30.2;17.4;17.4;8"
      />
      <animate
        attributeName="cy"
        begin="2.2s"
        dur="6s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;.1;.33333;.43333;.66666;.76666;1"
        keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1"
        values="136.3;136.3;143.4;143.4;139.3;139.3;136.3"
      />
    </circle>
    <circle class="radar-point" style="--point-delay: 1.15s" cx="8" cy="247" r="8">
      <animate
        attributeName="cx"
        begin="2.2s"
        dur="6s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;.1;.33333;.43333;.66666;.76666;1"
        keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1"
        values="8;8;27;27;19.9;19.9;8"
      />
      <animate
        attributeName="cy"
        begin="2.2s"
        dur="6s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;.1;.33333;.43333;.66666;.76666;1"
        keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1"
        values="247;247;220.8;220.8;230.5;230.5;247"
      />
    </circle>
    <circle class="radar-point" style="--point-delay: 1.45s" cx="89" cy="179.4" r="8">
      <animate
        attributeName="cx"
        begin="2.2s"
        dur="6s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;.1;.33333;.43333;.66666;.76666;1"
        keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1"
        values="89;89;118.8;118.8;103.1;103.1;89"
      />
      <animate
        attributeName="cy"
        begin="2.2s"
        dur="6s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;.1;.33333;.43333;.66666;.76666;1"
        keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1"
        values="179.4;179.4;220.8;220.8;198.9;198.9;179.4"
      />
    </circle>
    <circle class="radar-point" style="--point-delay: 1.75s" cx="177" cy="123.9" r="8">
      <animate
        attributeName="cx"
        begin="2.2s"
        dur="6s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;.1;.33333;.43333;.66666;.76666;1"
        keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1"
        values="177;177;149.9;149.9;168.9;168.9;177"
      />
      <animate
        attributeName="cy"
        begin="2.2s"
        dur="6s"
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;.1;.33333;.43333;.66666;.76666;1"
        keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1"
        values="123.9;123.9;132.5;132.5;126.4;126.4;123.9"
      />
    </circle>
  </g>

  <g class="radar-label">
    <text x="172" y="18">Rançongiciel &amp; extorsion</text>
    <text x="397" y="131">
      <tspan x="397" dy="0">Fraude au</tspan>
      <tspan x="397" dy="20">virement</tspan>
    </text>
    <text x="306" y="330">Cyberharcèlement</text>
    <text x="134.5" y="330" text-anchor="middle">
      <tspan x="134.5" dy="0">Espionnage stratégique</tspan>
      <tspan x="134.5" dy="20">&amp; industriel</tspan>
    </text>
    <text x="93" y="141" text-anchor="end">Déstabilisation</text>
  </g>

  <g aria-hidden="true" filter="url(#icon-shadow)">
    <circle cx="101" cy="42" r="32" fill="#fff" />
    <path
      d="M93.075 37.067c.085-.136.173-.269.265-.4h15.32c.092.13.18.265.265.4l2.694-1.555 1.333 2.309-2.951 1.704c.216.787.332 1.617.332 2.475v1.333h4v2.667h-4a9.285 9.285 0 0 1-.715 3.587l3.334 1.925-1.333 2.309-3.368-1.944a9.332 9.332 0 0 1-5.918 3.362V44.667h-2.666V55.24a9.332 9.332 0 0 1-5.918-3.363l-3.368 1.944-1.333-2.309 3.333-1.924A9.286 9.286 0 0 1 91.667 46h-4v-2.667h4V42c0-.857.116-1.687.332-2.475l-2.951-1.704 1.333-2.309 2.694 1.555ZM95.667 34a5.333 5.333 0 0 1 10.666 0H95.667Z"
      fill="#000091"
    />

    <circle cx="394" cy="68" r="32" fill="#fff" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M407.333 78.667v2.666h-26.666v-2.666h26.666ZM386 68v9.333h-2.667V68H386Zm6.667 0v9.333H390V68h2.667ZM398 68v9.333h-2.667V68H398Zm6.667 0v9.333H402V68h2.667ZM394 54.667l13.333 6.666v5.334h-26.666v-5.334L394 54.667Zm0 5.333a1.333 1.333 0 1 0 0 2.667A1.333 1.333 0 0 0 394 60Z"
      fill="#000091"
    />

    <circle cx="77" cy="252" r="24" fill="#fff" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M77 243c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9s-9.878-3.88-10.819-9c.94-5.12 5.427-9 10.819-9Zm0 4a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"
      fill="#000091"
    />
  </g>
</svg>

<style lang="scss">
  .radar-gradient {
    transform-origin: 243px 184px;
    animation: radar-gradient-rotation 8s linear infinite;
    will-change: transform;
  }

  .radar-label {
    fill: #000091;
    font-family: Marianne, Arial, sans-serif;
    font-size: 12px;
    font-weight: 400;
  }

  .radar-data-fill {
    fill: #6a6af4;
    opacity: 0;
    animation:
      radar-fill-reveal 1s ease-out 1.5s both,
      radar-fill-breathe 3.2s ease-in-out 2.5s infinite;
  }

  .radar-data-line {
    fill: none;
    stroke: #6a6af4;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation:
      radar-line-draw 1.8s cubic-bezier(0.65, 0, 0.35, 1) 0.2s both,
      radar-line-breathe 3.2s ease-in-out 2s infinite;
  }

  .radar-point {
    fill: #6a6af4;
    opacity: 0;
    transform-box: fill-box;
    transform-origin: center;
    animation:
      radar-point-reveal 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) var(--point-delay) both,
      radar-point-pulse 2.8s ease-in-out calc(var(--point-delay) + 0.45s) infinite;
  }

  @keyframes radar-gradient-rotation {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes radar-line-draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes radar-line-breathe {
    0%,
    100% {
      stroke-width: 3;
    }

    50% {
      stroke-width: 3.35;
    }
  }

  @keyframes radar-fill-reveal {
    to {
      opacity: 0.07;
    }
  }

  @keyframes radar-fill-breathe {
    0%,
    100% {
      opacity: 0.05;
    }

    50% {
      opacity: 0.12;
    }
  }

  @keyframes radar-point-reveal {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes radar-point-pulse {
    0%,
    100% {
      transform: scale(1);
      filter: drop-shadow(0 0 0 rgb(106 106 244 / 0));
    }

    50% {
      transform: scale(1.22);
      filter: drop-shadow(0 0 4px rgb(106 106 244 / 0.55));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .radar-gradient {
      animation: none;
    }

    .radar-data-line {
      animation: none;
      stroke-dashoffset: 0;
    }

    .radar-data-fill {
      animation: none;
      opacity: 0.07;
    }

    .radar-point {
      animation: none;
      opacity: 1;
      transform: none;
    }
  }
</style>
