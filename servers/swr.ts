export const fetcher = (...args: ArgsSWR) => fetch(...args).then((res) => res.json())
