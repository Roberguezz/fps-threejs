import { eventBus, GameEvents } from '../core/Events'
import type { EnemyHitEvent } from '../core/Events'

/**
 * Responsable exclusivamente de aplicar daño a entidades y emitir ENEMY_DEATH.
 * Sin lógica visual. Sin imports de Three.js.
 */
export class DamageApplier {

	constructor() {
		// Escuchar impactos
		this.onEnemyHit = this.onEnemyHit.bind(this)
		eventBus.on(GameEvents.ENEMY_HIT, this.onEnemyHit)
	}

	private onEnemyHit(data: EnemyHitEvent) {
		const { target, damage } = data

		// 1. Lógica matemática: Restar vida
		if (target && typeof target.takeDamage === 'function') {
			target.takeDamage(damage)

			// Si el objetivo ha muerto
			if (target.hp <= 0) {
				eventBus.emit(GameEvents.ENEMY_DEATH, { target })
			}
		}
	}

	public dispose() {
		eventBus.off(GameEvents.ENEMY_HIT, this.onEnemyHit)
	}
}
