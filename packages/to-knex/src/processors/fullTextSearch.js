const processFullTextSearch = (fullTextSearchNode, builder, options) => {
  const { fullTextSearch } = options
  const { value } = fullTextSearchNode

  builder.addGroup(nextBuilder => fullTextSearch(nextBuilder.knexBuilder, value))
}

export default processFullTextSearch
