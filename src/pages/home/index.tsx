/* eslint-disable react-hooks/exhaustive-deps */
import { useState, type FormEvent, useEffect } from 'react'
import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'

export interface CoinProps {
    id: string;
    name: string;
    symbol: string;
    priceUsd: string;
    changePercent24Hr: string;
    rank: string;
    supply: string;
    maxSupply: string;
    marketCapUsd: string;
    volumeUsd24Hr: string;
    explorer: string;
    valorMercadoformatado: string;
    volumeFormatado: string;
    Precoformatado?: string

}

interface DataProp {
    data: CoinProps[]
}

export function Home() {
    const [input, setInput] = useState("")
    const [coins, setCoins] = useState<CoinProps[]>([])
    const [offset, setOffset] = useState(0)
    const navigate = useNavigate();
    useEffect(() => {
        getData();
    }, [ offset])

    async function getData() {
        fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=7103e69591bae031bbbeabae12bc69f8e8af31b19fdc40f4d3293b1911c4f2d7`)
            .then(response => response.json())
            .then((data: DataProp) => {
                const coinsData = data.data;

                const preco = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD"
                })
                const precoCompact = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    notation: "compact"
                })

                const formatacaoResultado = coinsData.map((item) => {
                    const formatado = {
                        ...item,
                        Precoformatado: preco.format(Number(item.priceUsd)),
                        valorMercadoformatado: precoCompact.format(Number(item.marketCapUsd)),
                        volumeFormatado: precoCompact.format(Number(item.volumeUsd24Hr))
                    }

                    return formatado;
                })
                const listCoins = [...coins, ...formatacaoResultado]
                setCoins(listCoins);
                //console.log(formatacaoResultado)
            })
    }
    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (input === "") return;
        navigate(`/detail/${input}`)
    }

    function handleGetMore() {
        if (offset === 0) {
            setOffset(10)
            return;
        }
        setOffset(offset + 10)
    }
    return (
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input type="text"
                    placeholder='Digite o nome da moeda para buscar'
                    value={input}
                    onChange={(e) => setInput(e.target.value)} />
                <button type="submit">
                    <BsSearch size={30} color="#FFF" />
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th scope="col">Moeda</th>
                        <th scope="col">Valor de Mercado</th>
                        <th scope="col">Preço</th>
                        <th scope="col">Volume</th>
                        <th scope="col">Mudança em 24 horas</th>
                    </tr>
                </thead>
                <tbody id="tbody">
                    {
                        coins.length > 0 && coins.map((item) => (
                            <tr className={styles.tr} key={item.id}>
                                <td className={styles.tdLabel} data-label="Moeda">
                                    <div className={styles.name}>
                                        <img
                                            className={styles.logo}
                                            src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} alt="Logo Moeda" />
                                        <Link to={`/detail/${item.id}`}>
                                            <span>{item.name}</span> | {item.symbol}
                                        </Link>
                                    </div>
                                </td>
                                <td className={styles.tdLabel} data-label="Valor de Mercado">
                                    {item.valorMercadoformatado}

                                </td>

                                <td className={styles.tdLabel} data-label="Preço">
                                    {item.Precoformatado}
                                </td>

                                <td className={styles.tdLabel} data-label="Volume">
                                    {item.volumeFormatado}
                                </td>

                                <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança em 24 horas">
                                    <span>{Number(item.changePercent24Hr).toFixed(3

                                    )}</span>
                                </td>
                            </tr>
                        )
                        )
                    }
                </tbody>
            </table>

            <button className={styles.buttonMore} onClick={handleGetMore}>
                Mostrar mais
            </button>
        </main>
    )
}

