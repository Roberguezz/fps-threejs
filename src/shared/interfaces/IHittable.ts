/**
 * Contrato para cualquier entidad que pueda recibir daño.
 * Desacopla el sistema de daño de clases concretas como Dummy.
 */
export interface IHittable {
	hp: number
	takeDamage(amount: number): void
}
