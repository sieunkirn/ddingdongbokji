import React, { useState } from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';
import styled from 'styled-components';

const AddressContainer = styled.div`
    margin: 20px 0;
`;

const Title = styled.h3`
    color: #2c5530;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 500;
`;

const AddressInputWrapper = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
`;

const AddressInput = styled.input`
    flex: 1;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    background: white;

    &::placeholder {
        color: #999;
    }

    &:focus {
        outline: none;
        border-color: #4CAF50;
    }
`;

const SearchButton = styled.button`
    padding: 15px 20px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 18px;
    transition: background 0.3s;

    &:hover {
        background: #45a049;
    }
`;

const Modal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
`;

const ModalContent = styled.div`
    width: 90%;
    max-width: 500px;
    background: white;
    border-radius: 15px;
    padding: 20px;
    max-height: 80vh;
    overflow: hidden;
`;

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
`;

const ModalTitle = styled.h3`
    margin: 0;
    color: #333;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PostcodeContainer = styled.div`
    height: 400px;
    border-radius: 8px;
    overflow: hidden;
`;

const AddressInfo = styled.div`
    background: #f8f9fa;
    padding: 20px;
    border-radius: 12px;
    margin: 20px 0;
    border-left: 4px solid #4CAF50;
`;

const AddressLabel = styled.div`
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
`;

const AddressText = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: #333;
    line-height: 1.4;
`;

const AddressSearch = ({ onAddressSelect, placeholder = "주소 검색하기" }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');

    const handleComplete = (data) => {
        const fullAddress = data.roadAddress || data.address;
        const region = `${data.sido} ${data.sigungu}`.trim();

        setSelectedAddress(fullAddress);
        setSelectedRegion(region);
        setIsModalOpen(false);

        if (onAddressSelect) {
            onAddressSelect({
                address: fullAddress,
                region: region,
                zonecode: data.zonecode,
                sido: data.sido,
                sigungu: data.sigungu
            });
        }
    };

    return (
        <AddressContainer>
            <Title>거주하고 계신 주소를 입력해 주세요.</Title>
            <AddressInputWrapper>
                <AddressInput
                    type="text"
                    placeholder={placeholder}
                    value={selectedAddress}
                    onClick={() => setIsModalOpen(true)}
                    readOnly
                />
                <SearchButton onClick={() => setIsModalOpen(true)}>
                    🔍
                </SearchButton>
            </AddressInputWrapper>

            {selectedAddress && (
                <AddressInfo>
                    <AddressLabel>선택된 주소</AddressLabel>
                    <AddressText>{selectedAddress}</AddressText>
                    {selectedRegion && (
                        <div style={{ marginTop: '10px' }}>
                            <AddressLabel>지역</AddressLabel>
                            <AddressText style={{ color: '#4CAF50' }}>{selectedRegion}</AddressText>
                        </div>
                    )}
                </AddressInfo>
            )}

            {isModalOpen && (
                <Modal onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>주소 검색</ModalTitle>
                            <CloseButton onClick={() => setIsModalOpen(false)}>
                                ×
                            </CloseButton>
                        </ModalHeader>
                        <PostcodeContainer>
                            <DaumPostcodeEmbed
                                onComplete={handleComplete}
                                autoClose={false}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </PostcodeContainer>
                    </ModalContent>
                </Modal>
            )}
        </AddressContainer>
    );
};

export default AddressSearch;
