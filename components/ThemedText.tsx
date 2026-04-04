import React from 'react'
import { StyleSheet, Text, type TextProps } from 'react-native'

type ThemedTextType = 'default' | 'title' | 'link'

type ThemedTextProps = TextProps & {
  type?: ThemedTextType
}

export function ThemedText({ type = 'default', style, ...rest }: ThemedTextProps) {
  return <Text style={[styles[type], style]} {...rest} />
}

const styles = StyleSheet.create({
  default: {
    color: '#11181C',
    fontSize: 16,
  },
  title: {
    color: '#11181C',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  link: {
    color: '#0a7ea4',
    fontSize: 16,
    fontWeight: '600',
  },
})