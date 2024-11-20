type ContentWrapperProps = {
  children: React.ReactNode,
}

const ContentWrapper = (props: ContentWrapperProps) => {
  const { children } = props;

  return (
    <div className="container flex mx-auto">
      {children}
    </div>
  );
};

export default ContentWrapper;
