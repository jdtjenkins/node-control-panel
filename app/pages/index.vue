<template>
  <section class="container">
	<input type="text" @keyup.enter="sendUrl" v-model="search">
	<div class="cards">
		<div class="card" v-for="folder in folders">
			<h1>
				{{ folder.projectName }}
				<small>{{ folder.folderPath }}</small>
			</h1>
            <ul>
                <li v-for="script in folder.packageJson.scripts">
                    <toggle-button
                        :value="script.launched"
                        @input="toggleScript(folder.folderPath, script.name, script.launched)"
                        >
                        <pre>{{ script.name }}</pre>
                    </toggle-button>
                    <div class="stdout">
                        <pre v-for="stdout in script.stdout">
                            {{ stdout }}
                        </pre>
                    </div>
                </li>
            </ul>
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
		async toggleScript(folderPath, scriptName, launched) {
            if (!launched) {
                ws.send(JSON.stringify({
                    action: 'startScript',
                    payload: {
                        project: folderPath,
                        scriptName,
                    },
                }));

            } else {
                ws.send(JSON.stringify({
                    action: 'stopScript',
                    payload: {
                        project: folderPath,
                        scriptName,
                    },
                }));
            }

            this.folderList.find(project => project.folderPath === folderPath).packageJson.scripts[scriptName].launched = !launched;
        },
	},
	data() {
		return {
			folderList: [],
			search: `c:/node/projects`,
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
				const { action, payload } = JSON.parse(message.data);

				switch (action){
					case 'searchResult':
						for (let folder of payload.folders){
							if (!this.folderList.find(({ folderPath }) => folderPath === folder.folderPath)) {
                                for (let key in folder.packageJson.scripts) {
                                    folder.packageJson.scripts[key] = {
                                        script: folder.packageJson.scripts[key],
                                        name: key,
                                        launched: false,
                                        stdout: [],
                                        stderr: [],
                                    }
                                }

                                this.folderList = [
									...this.folderList,
									{
										...folder,
										searchTerm: this.search,
									},
								];
							}
						}
						break;
                    case 'childStdout':
                        this.folderList.find(project => project.folderPath === payload.project).packageJson.scripts[payload.scriptName].stdout.push(payload.stdout);
                        break;
                    case 'childStop':
                        console.log(payload)
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
        margin-bottom: 1rem;
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

    .card ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .card ul li {
        margin-bottom: 0.5rem;
    }

</style>
