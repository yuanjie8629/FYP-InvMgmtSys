import AbcAnalysis from './AbcAnalysis';
import abcUtils from './AbcAnalysis/AbcAnalysisUtils';
import hmlUtils from './HmlAnalysis/HmlAnalysisUtils';
import eoqUtils from './EoqAnalysis/EoqAnalysisUtils';
import ssUtils from './SsAnalysis/SsAnalysisUtils';
import HmlAnalysis from './HmlAnalysis';
import EoqAnalysis from './EoqAnalysis';
import SsAnalysis from './SsAnalysis';

const tableGradeProps = { width: 50, height: 60, fontSize: 30 };

export type AnalysisType = 'abc' | 'hml' | 'eoq' | 'ss';

export { AbcAnalysis, HmlAnalysis, EoqAnalysis, SsAnalysis, tableGradeProps };

export { abcUtils, hmlUtils, eoqUtils, ssUtils };
