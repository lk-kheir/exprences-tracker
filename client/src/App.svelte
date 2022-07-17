<script>
    import axios from 'axios';
    import {onMount} from 'svelte'
    let input = 0;
    let typeOfTransaction = '+'
    let transactions = [];

    onMount(async () => {
        const {data , status} = await axios.get('/api/transactions');
        transactions = data;
    })
    let addTransaction = async () => {
        const transaction = {
            date : new Date().getTime(),
            value : typeOfTransaction === '+' ? input : (input * -1)
        }

        const res = await axios.post('api/transactions' , transaction)

        transactions = [...transactions , res.data]
        input = 0;
    };

    async function removeTransaction(id) {
        const response = await axios.delete("/api/transactions/" + id);
        if (response.data.id === id) {
            transactions = transactions.filter(t => t._id !== id);
        }
    }

</script>


<div class="app container">
    <div class="field had-addons">
        <p class="control">
            <span class="select">
                <select bind:value={typeOfTransaction}>
                    <option value="+">+</option>
                    <option value="-">-</option>
                </select>
            </span>
        </p>
        <p class="control is-expanded">
            <input class="input" type="number" bind:value={input} placeholder="Amount of money">
        </p>
        <p class="control">
            <button class="button" on:click={addTransaction}>save</button>
        </p>

    </div>
    <p>{input}</p>
    <p>{typeOfTransaction}</p>
    {#each transactions as transaction}
        <div class="notification">
            {transaction.value}
            <button class="delete" on:click={() => removeTransaction(transaction._id)}></button>
        </div>
    {/each}
</div>

<style>

    .app {
        margin: auto;
        max-width: 40%;
    }
    .field {
        display: flex;
    }
</style>
