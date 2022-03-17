interface Props {
	children: string;
	global ?: boolean;
}

function Style({ children, global = false } : Props) {
  return (
	<style {...{ jsx : true, global}}>
		{children}
	</style>
  )
}

export default Style;