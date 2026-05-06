import { eventBus, GameEvents } from '../../core/Events'

export class UIManager {
	private hitmarker: HTMLElement | null = null
	private hitmarkerTimeout: any = null

	constructor() {
		this.hitmarker = document.getElementById('hitmarker')

		// Escuchar impactos para mostrar hitmarker
		this.onEnemyHit = this.onEnemyHit.bind(this)
		eventBus.on(GameEvents.ENEMY_HIT, this.onEnemyHit)
	}

	private onEnemyHit() {
		this.showHitmarker()
	}

	private showHitmarker() {
		if (this.hitmarker) {
			this.hitmarker.style.display = 'block'

			if (this.hitmarkerTimeout) clearTimeout(this.hitmarkerTimeout)

			this.hitmarkerTimeout = setTimeout(() => {
				if (this.hitmarker) this.hitmarker.style.display = 'none'
				this.hitmarkerTimeout = null
			}, 100)
		}
	}

	public dispose() {
		eventBus.off(GameEvents.ENEMY_HIT, this.onEnemyHit)
	}
}
