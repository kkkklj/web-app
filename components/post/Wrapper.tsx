
export default function Wrapper(props:any) {
  return (
    <div style={{padding: '20px', backgroundColor: 'grey'}}>
      <main {...props} />
    </div>
  )
}