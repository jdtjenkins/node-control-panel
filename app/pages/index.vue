<template>
  <section class="container">
    <h1>Hello there</h1>
	<input type="text" @blur="sendUrl">
  </section>
</template>

<script>
const ws = new WebSocket('ws://localhost:1338');

export default {
	methods: {
		sendUrl(e) {
			const input = e.target.value;
			ws.send(input)
		},
	},
	data() {
		return {
			folderList: [],
		}
	},
	created() {
		//const ws = new WebSocket('ws://localhost:1338');
	},
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
