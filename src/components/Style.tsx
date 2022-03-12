interface Props {
	children: string;
	global ?: boolean;
}

function Style({ children, global = false } : Props) {
  return (
    // @ts-ignore
	<style {...{ jsx : "true", global : global.toString()}}>
		{children}
	</style>
  )
}

export default Style;
