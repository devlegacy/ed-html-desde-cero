const hrm = (module) => {
  // console.log(ENV);
  if (ENV !== 'production' && module.hot) {
    module.hot.accept();
  }
}

export default hrm;
