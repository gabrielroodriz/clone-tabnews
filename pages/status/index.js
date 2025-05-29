import useSWR from "swr";

async function fetchAPI(key) {
  return await (await fetch(key)).json();
}

function UpdatedAt(props) {
  let updatedAtText = "Valor indisponível"
  if(props.date) {
     updatedAtText = new Date(props.date).toLocaleString("pt-BR")
  }
  return <div>Ultima atualização: {updatedAtText}</div>;
}

function DatabaseStatus(props) {
  return (
  <>
  <h2>{`Número de conexões atuais: ${props.params.current_connections}`}</h2>
  <h2>{`Número máximo de conexões: ${props.params.max_connections}`}</h2>
  <h2>{`Versão do servidor: ${props.params.server_version}`}</h2>
  </>
  )
}

export default function StatusPage() {
  const {isLoading, data} = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  })
  return isLoading ? <h1>Carregando</h1> :(
    <>
    <h1>Status de serviços</h1>
    <UpdatedAt date={data.updated_at}/>
    <DatabaseStatus params={data.dependencies.database}/>
    </>

  );
}
