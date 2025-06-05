import {useEffect, useState } from 'react'
import { useParams, useNavigate  } from 'react-router-dom'
import type { CoinProps } from '../home';
import styles from './detail.module.css'

interface ResponseData{
    data: CoinProps
}

interface ErrorData {
    error: string;
}

type DataProps = ResponseData | ErrorData

export function Detail() {
    const { cripto } = useParams();
    const navigate = useNavigate();

    const [coin, setCoin] = useState<CoinProps>()

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getCoin(){
            try{
                fetch(`rest.coincap.io/v3/assets/${cripto}`)
                .then(response => response.json())
                .then((data: DataProps) => {
                    if("error" in data){
                        navigate("/")
                        return;
                    }

                    const price = Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD"
                    })

                    const priceCompact = Intl.NumberFormat("en-US", {
                        style:"currency",
                        currency:"USD",
                        notation: "compact"
                    })

                    const resultData = {
                        ...data.data,
                        Precoformatado: price.format(Number(data.data.priceUsd)),
                        valorMercadoformatado: priceCompact.format(Number(data.data.marketCapUsd)),
                        volumeFormatado: priceCompact.format(Number(data.data.volumeUsd24Hr))
                    }
                    setCoin(resultData)
                    setLoading(false)


                
                })


            }catch(error){
                console.log(error);
                navigate("/")
            }
        }
        getCoin();
    }, [cripto])

    if(loading || !coin){
        return(
            <div className={styles.container}>
                <h4 className={styles.center}>Carregando detalhes...</h4>
            </div>
        )
    }

    return (
    <div className={styles.container}>
        <h1 className={styles.center}>{coin?.name}</h1>
        <h1 className={styles.center}>{coin?.symbol}</h1>

        <section className = {styles.content}></section>
        <img 
        src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`} alt= "Logo da moeda"
        className={styles.logo} />
    </div>
    )
}

