<script>
    import axios from 'axios';
    import {onMount} from 'svelte'
    import Transaction from "./components/Transaction.svelte";
    import SummaryCard from "./components/SummaryCard.svelte";
    import Loading from "./components/Loading.svelte";
    import {transactions} from "./stores";

    let input = 0;
    let typeOfTransaction = '+';
    let loading = false;

    $: disabled = !input;
    $: balance = $transactions.reduce((acc , t) => acc + t.value , 0)
    $: income = $transactions.filter(t => t.value > 0).reduce((acc , t) => acc + t.value , 0)
    $: expenses = $transactions.filter(t => t.value < 0).reduce((acc , t) => acc + t.value , 0)
    $: sortedTransactions = $transactions.sort((a , b) => b.date - a.date)


    onMount(async () => {
        loading = true;
        const {data , status} = await axios.get('/api/transactions');
        $transactions = data;
        loading = false;
    })
    let addTransaction = async () => {
        const transaction = {
            date : new Date().getTime(),
            value : typeOfTransaction === '+' ? input : (input * -1)
        }

        const res = await axios.post('api/transactions' , transaction)

        $transactions = [...$transactions , res.data]
        input = 0;
    };

    async function removeTransaction(id) {
        const response = await axios.delete("/api/transactions/" + id);
        if (response.data.id === id) {
            $transactions = $transactions.filter(t => t._id !== id);
        }
    }

</script>
<section class="note">
    DR. Sid Ali Boussla is the best
</section>
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
            <button class="button" on:click={addTransaction} {disabled}>save</button>
        </p>

    </div>

    {#if loading}
        <Loading/>
    {/if}
    {#if $transactions.length > 0}
        <div class="column">

            <SummaryCard mode="balance" value={balance}/>
        </div>

        <div class="columns">
            <div class="column">
                <SummaryCard mode="income" value={income}/>
            </div>
            <div class="column">
                <SummaryCard mode="expenses" value={expenses}/>
            </div>
        </div>
        {:else if !loading}
        <div class="notification info has-text-centered">
            Add your first transaction
        </div>
    {/if}
    {#each sortedTransactions as transaction}
        <Transaction {transaction} {removeTransaction}/>
    {/each}
</div>

<style>

    .app {
        margin: 20vh auto;
        max-width: 40%;
    }
    .field {
        display: flex;
        justify-content: center;
        align-self: center;
    }

    .note {
        position: fixed;
        width: 100%;
        text-align: center;
        top: 0;
        padding: 10px;
        background: wheat;
        color: white;
        font-size: unset;
        letter-spacing: 3px;
    }


</style>
