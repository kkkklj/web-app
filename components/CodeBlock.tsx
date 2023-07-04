import React from 'react'
import {HighlightProps,Highlight} from 'prism-react-renderer'
type TypeProps =  any
const codeBlock = `
const GroceryItem: React.FC<GroceryItemProps> = ({ item }) => {
  return (
    <div>
      <h2>{item.name}</h2>
      <p>Price: {item.price}</p>
      <p>Quantity: {item.quantity}</p>
    </div>
  );
}
`
const CodBlock = (props:TypeProps) => {
  const {children,code, className} = props
  const language = className?.replace(/language-/, '') || 'txt'
  console.log('className',className,code,props)
  // return (<pre style={{color: 'tomato'}} {...props} />)
  // if(!code) {
  //   return (
  //     <></>
  //   )
  // }
  return (
    <Highlight {...props} code={typeof props.children === 'string' && props.children || codeBlock} language={language} >
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <pre className={className} style={{...style, padding: '20px'}}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({line, key: i})}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({token, key})} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}



export default CodBlock 