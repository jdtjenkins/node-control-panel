<template lang="html">
	<div class="toggle-button">
		<slot />
		<div
			class="toggle"
			:class="value ? 'checked' : 'not-checked'"
			@click="toggle"
			></div>
	</div>
</template>

<script>
	export default {
		name: 'toggle-button',
		props: {
			value: Boolean,
		},
		methods: {
			toggle() {
				this.$emit('input', !this.value);
			},
		},
	}
</script>

<style lang="css" scoped>
	.toggle-button {
		align-items: center;
		justify-content: center;
		display: inline-flex;
	}

	.toggle {
		width: 50px;
		height: 25px;
		background: #eee;
		border: none;
		border-radius: 20px;
		box-shadow: 2px 2px 2px #e0e0e0;
		margin-left: 0.5rem;
		position: relative;
	}

	.toggle:after {
		content:  '';
		position: absolute;
		width: 18px;
		height: 18px;
		top: 50%;
		transform: translateY(-50%);
		left: 5px;
		transition: all .2s ease;
		background: #fff;
		border-radius: 50%;
	}

	.toggle.checked {
		background: lightgreen;
	}

	.toggle.checked:after {
		left: 27px;
	}
</style>
