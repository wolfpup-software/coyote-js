interface SlidingWindowInterface {
	slide(glyph: string): boolean;
}

class SlidingWindow implements SlidingWindow {
	#index: number = 0;
	#target: string;

	constructor(target: string) {
		this.#target = target;
	}

	slide(glyph: string): boolean {
		if (this.#index > this.#target.length) {
			this.#index = 0;
		}

		if (this.#target.charAt(this.#index - 1) !== glyph) {
			this.#index == 0;
		}

		this.#index += 1;

		return this.#index > this.#target.length;
	}
}

export type { SlidingWindowInterface };

export { SlidingWindow };
