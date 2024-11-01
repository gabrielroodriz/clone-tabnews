function status(request, response) {
    response.status(200).json({chave: "acima da média"})
}

export default status;