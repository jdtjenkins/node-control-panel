<template>
  <section class="container">
	<input type="text" @keyup.enter="sendUrl" v-model="search">
	<div class="cards">
		<div class="card" v-for="folder in folders">
			<h1>
				{{ folder.projectName }}
				<small>{{ folder.folderPath }}</small>
			</h1>
			<br>
			<toggle-button v-model="folder.launched">
				Launch server
			</toggle-button>
		</div>
	</div>
  </section>
</template>

<script>
const ToggleButton = require('../components/toggle-button').default;
const ws = new WebSocket('ws://localhost:1338');

export default {
	components: {
		ToggleButton,
	},
	methods: {
		sendUrl() {
			ws.send(JSON.stringify({
				action: 'search',
				payload: this.search,
			}));
		},
		async launchServer(folderPath) {
			this.folderList.filter(({ folderPath }) => folderPath === folderPath).launched = true;
		},
	},
	data() {
		return {
			folderList: [],
			search: '/Users/jacob/www',
		}
	},
	computed: {
		folders() {
			return this.folderList.filter(({ searchTerm }) => searchTerm === this.search);
		},
	},
	created() {
		ws.onopen = () => {
			ws.onmessage = message => {
				message = JSON.parse(message.data);

				switch (message.action){
					case 'searchResult':
						for (let folder of message.payload.folders){
							if (!this.folderList.find(({ folderPath }) => folderPath === folder.folderPath)) {
								this.folderList = [
									...this.folderList,
									{
										...folder,
										searchTerm: this.search,
										launched: false,
									},
								];
							}
						}
						break;
				}

			};
		}
	},
}
</script>

<style>
	.container {
	  margin: 0 auto;
	  min-height: 100vh;
	  padding: 2rem 0;
	  display: flex;
	  justify-content: flex-start;
	  align-items: center;
	  text-align: center;
	  flex-direction: column;
	}

	.container > input[type="text"] {
		padding: 0.75rem 1rem;
		border-radius: 20px;
		width: 75%;
		border: 0;
		background-color: #eee;
		color: #333;
		outline: 0;
	}

	.container > input[type="text"]:focus {
		box-shadow: 0 0 1px blue;
	}

	.cards {
		width: 100%;
		padding: 0 1rem;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.card {
		margin: 0.75rem;
		border: 1px solid #efefef;
		box-shadow: 1px 1px 2px #e0e0e0;
		border-radius: 5px;
		padding: 1rem;
		text-align: left;
		flex-grow: 1;
		flex-shrink: 1;
		flex-basis: 1;
	}

	.card h1 {
		font-size: 1.5rem;
		color: #333;
	}

	.card h1 small {
		font-size: 0.75rem;
		color: #dfdfdf;
		display: block;
		margin-top: 0.5rem;
	}

	.card h1, .card h1 small {
		word-wrap: break-word;
	}

</style>
